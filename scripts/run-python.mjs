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

if (process.env.DEBUG) {
  console.log(`[PYTHON-LAUNCHER] Platform: ${os.platform()}`);
  console.log(`[PYTHON-LAUNCHER] Using Python: ${resolved.cmd} ${resolved.prefix.join(' ')}`.trim());
}

const child = spawn(resolved.cmd, runArgs, {
  stdio: 'inherit',
  shell: false,
  env: { ...process.env, PYTHONPATH: process.cwd() }
});

child.on('exit', (code) => process.exit(code || 0));
child.on('error', (err) => {
  console.error('[PYTHON-LAUNCHER] Critical Error:', err.message);
  process.exit(1);
});
