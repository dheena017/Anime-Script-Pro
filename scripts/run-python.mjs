import { spawn } from 'child_process';
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

// Fallback to system python if venv doesn't exist
const pythonPath = fs.existsSync(venvPython) ? venvPython : (isWin ? 'python' : 'python3');

const args = process.argv.slice(2);

if (process.env.DEBUG) {
  console.log(`[PYTHON-LAUNCHER] Platform: ${os.platform()}`);
  console.log(`[PYTHON-LAUNCHER] Using Python: ${pythonPath}`);
}

const child = spawn(pythonPath, args, { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, PYTHONPATH: process.cwd() }
});

child.on('exit', (code) => process.exit(code || 0));
child.on('error', (err) => {
  console.error('[PYTHON-LAUNCHER] Critical Error:', err.message);
  process.exit(1);
});
