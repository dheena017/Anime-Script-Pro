import { spawn } from 'child_process';
import { spawnSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
// ANSI Styling Utilities
const cyan = (text) => `\x1b[36m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;
const gray = (text) => `\x1b[90m${text}\x1b[0m`;
const magenta = (text) => `\x1b[35m${text}\x1b[0m`;

/**
 * Cross-platform Python runner for Anime Script Pro.
 * Automatically detects the virtual environment and platform.
 */

const isWin = os.platform() === 'win32';
const venvPython = isWin
  ? path.join(process.cwd(), 'backend', 'venv', 'Scripts', 'python.exe')
  : path.join(process.cwd(), 'backend', 'venv', 'bin', 'python');

function canRun(cmd, probeArgs = ['--version']) {
  const result = spawnSync(cmd, probeArgs, { stdio: 'ignore', shell: false });
  return result.status === 0;
}

function resolvePython() {
  const candidates = [];

  if (fs.existsSync(venvPython)) {
    candidates.push({ cmd: venvPython, prefix: [] });
  }

  if (isWin) {
    candidates.push({ cmd: 'py', prefix: ['-3.11'] });
    candidates.push({ cmd: 'py', prefix: ['-3.12'] });
    candidates.push({ cmd: 'py', prefix: ['-3.13'] });
    candidates.push({ cmd: 'py', prefix: ['-3'] });
    candidates.push({ cmd: 'python', prefix: [] });
    candidates.push({ cmd: 'python3', prefix: [] });
  } else {
    candidates.push({ cmd: 'python3', prefix: [] });
    candidates.push({ cmd: 'python', prefix: [] });
  }

  for (const candidate of candidates) {
    if (canRun(candidate.cmd, [...candidate.prefix, '--version'])) {
      return candidate;
    }
  }

  return null;
}

const resolved = resolvePython();
if (!resolved) {
  console.error(`${bold(red('[PYTHON-LAUNCHER]'))} No usable Python interpreter found.`);
  console.error(`${bold(red('[PYTHON-LAUNCHER]'))} Expected one of: backend\\venv, py -3.11, py -3, python, python3`);
  process.exit(1);
}

const args = process.argv.slice(2);
const runArgs = [...resolved.prefix, ...args];
const isReload = runArgs.includes('--reload');

if (process.env.DEBUG || true) {
  console.log(`\n${bold(magenta('[LAUNCHER]'))} Platform: ${cyan(os.platform())}`);
  console.log(`${bold(magenta('[LAUNCHER]'))} Command:  ${yellow(resolved.cmd)} ${runArgs.join(' ')}`);
  console.log(`${bold(magenta('[LAUNCHER]'))} Directory: ${gray(process.cwd())}\n`);
}

let activeChild = null;

async function startProcess() {
  return new Promise((resolve) => {
    const child = spawn(resolved.cmd, runArgs, {
      stdio: 'inherit',
      shell: false,
      env: { ...process.env, PYTHONPATH: process.cwd() },
      ...(os.platform() === 'win32' ? { creationFlags: 0x00000200 } : {})
    });
    activeChild = child;

    child.on('exit', (code) => {
      activeChild = null;
      if (!isShuttingDown && code !== 0 && code !== null) {
        console.error(`\n${bold(red('[PYTHON-LAUNCHER]'))} Process exited with code ${cyan(code)}`);
        if (code === 1) {
          console.error(`${bold(yellow('[PYTHON-LAUNCHER]'))} Tip: This often indicates a syntax error or a port conflict.`);
        }
      }
      resolve(code);
    });

    child.on('error', (err) => {
      activeChild = null;
      console.error(`\n${bold(red('[PYTHON-LAUNCHER]'))} Critical Spawn Error: ${err.message}`);
      resolve(1);
    });
  });
}

let isShuttingDown = false;

async function supervisor() {
  let restartCount = 0;
  const maxRestarts = 20;
  const resetInterval = 30000;

  // Handle termination signals to ensure we don't restart when the user wants to quit
  const cleanup = () => {
    isShuttingDown = true;
    console.log(`\n${bold(yellow('[PYTHON-LAUNCHER]'))} Shutdown signal received. Cleaning up gracefully...`);
    
    // Give the child process 1.5 seconds to shut down gracefully before forcing it
    setTimeout(() => {
      if (activeChild) {
        console.log(`${bold(yellow('[PYTHON-LAUNCHER]'))} Fail-safe: Forcefully terminating remaining Python processes.`);
        try {
          if (os.platform() === 'win32') {
            spawnSync('taskkill', ['/pid', activeChild.pid, '/f', '/t']);
          } else {
            activeChild.kill('SIGKILL');
          }
        } catch (e) {}
      }
      process.exit(0);
    }, 1500);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  while (!isShuttingDown) {
    const startTime = Date.now();
    const code = await startProcess();

    if (isShuttingDown) {
      process.exit(0);
    }

    // In reload mode, uvicorn should never exit with 0 unless interrupted.
    // If it does exit (e.g. on Windows during certain file operations), we restart it.
    if (!isReload && (code === 0 || code === null)) {
      process.exit(code || 0);
    }

    const duration = Date.now() - startTime;
    if (duration > resetInterval) {
      restartCount = 0;
    }

    restartCount++;
    if (restartCount > maxRestarts) {
      console.error(`${bold(red('[PYTHON-LAUNCHER]'))} Maximum restart limit reached (${maxRestarts}). Aborting.`);
      process.exit(1);
    }

    console.log(`${bold(yellow('[PYTHON-LAUNCHER]'))} Restarting in 2 seconds... (Attempt ${restartCount}/${maxRestarts})`);
    await new Promise(r => setTimeout(r, 2000));
  }
}

if (isReload) {
  supervisor();
} else {
  // Original one-shot behavior
  const child = spawn(resolved.cmd, runArgs, {
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, PYTHONPATH: process.cwd() },
    ...(os.platform() === 'win32' ? { creationFlags: 0x00000200 } : {})
  });
  activeChild = child;

  const cleanupOneShot = () => {
    isShuttingDown = true;
    console.log(`\n${bold(yellow('[PYTHON-LAUNCHER]'))} Shutdown signal received. Cleaning up gracefully...`);
    
    setTimeout(() => {
      if (activeChild) {
        console.log(`${bold(yellow('[PYTHON-LAUNCHER]'))} Fail-safe: Forcefully terminating remaining Python processes.`);
        try {
          if (os.platform() === 'win32') {
            spawnSync('taskkill', ['/pid', activeChild.pid, '/f', '/t']);
          } else {
            activeChild.kill('SIGKILL');
          }
        } catch (e) {}
      }
      process.exit(0);
    }, 1500);
  };
  process.on('SIGINT', cleanupOneShot);
  process.on('SIGTERM', cleanupOneShot);

  child.on('exit', (code) => {
    activeChild = null;
    if (!isShuttingDown && code !== 0 && code !== null) {
      console.error(`\n${bold(red('[PYTHON-LAUNCHER]'))} Process exited with code ${cyan(code)}`);
    }
    setTimeout(() => process.exit(isShuttingDown ? 0 : (code || 0)), 100);
  });

  child.on('error', (err) => {
    activeChild = null;
    console.error(`\n${bold(red('[PYTHON-LAUNCHER]'))} Critical Spawn Error: ${err.message}`);
    process.exit(1);
  });
}
