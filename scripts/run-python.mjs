import { spawn } from 'child_process';
import { spawnSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

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
  console.error('[PYTHON-LAUNCHER] No usable Python interpreter found.');
  console.error('[PYTHON-LAUNCHER] Expected one of: backend\\venv, py -3.11, py -3, python, python3');
  process.exit(1);
}

const args = process.argv.slice(2);
const runArgs = [...resolved.prefix, ...args];
const isReload = runArgs.includes('--reload');

if (process.env.DEBUG || true) {
  console.log(`\n[LAUNCHER] Platform: ${os.platform()}`);
  console.log(`[LAUNCHER] Command: ${resolved.cmd} ${runArgs.join(' ')}`);
  console.log(`[LAUNCHER] Directory: ${process.cwd()}\n`);
}

async function startProcess() {
  return new Promise((resolve) => {
    const child = spawn(resolved.cmd, runArgs, {
      stdio: 'inherit',
      shell: false,
      env: { ...process.env, PYTHONPATH: process.cwd() }
    });

    child.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\n[PYTHON-LAUNCHER] Process exited with code ${code}`);
        if (code === 1) {
          console.error('[PYTHON-LAUNCHER] Tip: This often indicates a syntax error or a port conflict.');
        }
      }
      resolve(code);
    });

    child.on('error', (err) => {
      console.error('\n[PYTHON-LAUNCHER] Critical Spawn Error:', err.message);
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
    console.log('\n[PYTHON-LAUNCHER] Shutdown signal received. Cleaning up...');
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  while (!isShuttingDown) {
    const startTime = Date.now();
    const code = await startProcess();

    if (isShuttingDown) {
      process.exit(code || 0);
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
      console.error(`[PYTHON-LAUNCHER] Maximum restart limit reached (${maxRestarts}). Aborting.`);
      process.exit(1);
    }

    console.log(`[PYTHON-LAUNCHER] Restarting in 2 seconds... (Attempt ${restartCount}/${maxRestarts})`);
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
    env: { ...process.env, PYTHONPATH: process.cwd() }
  });

  child.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n[PYTHON-LAUNCHER] Process exited with code ${code}`);
    }
    setTimeout(() => process.exit(code || 0), 100);
  });

  child.on('error', (err) => {
    console.error('\n[PYTHON-LAUNCHER] Critical Spawn Error:', err.message);
    process.exit(1);
  });
}
