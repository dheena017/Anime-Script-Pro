#!/usr/bin/env node
/**
 * setup-backend.mjs
 * Creates a Python virtual environment under backend/venv and installs
 * all dependencies from backend/requirements.txt.
 */

import { execSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const root = resolve(__dirname, '..');

const cyan  = (t) => `\x1b[36m${t}\x1b[0m`;
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const bold  = (t) => `\x1b[1m${t}\x1b[0m`;

console.log(bold(cyan('\n🐍 ANIME SCRIPT PRO — Backend Setup\n')));

const venvDir = join(root, 'backend', 'venv');

// 1. Find python
const pythonCandidates = ['python', 'python3'];
let sysPython = null;
for (const p of pythonCandidates) {
  const result = spawnSync(p, ['--version'], { encoding: 'utf8' });
  if (result.status === 0) { sysPython = p; break; }
}

if (!sysPython) {
  console.error('❌ Python not found on PATH. Please install Python 3.8+ first.');
  process.exit(1);
}
console.log(`${yellow('✓')} Found Python: ${sysPython}`);

// 2. Create venv (skip if already exists)
if (existsSync(venvDir)) {
  console.log(`${yellow('!')} Virtual environment already exists — skipping creation.`);
} else {
  console.log(`${yellow('[1/2]')} Creating virtual environment at backend/venv …`);
  execSync(`${sysPython} -m venv "${venvDir}"`, { stdio: 'inherit', cwd: root });
  console.log(green('✓ Virtual environment created.\n'));
}

// 3. Install requirements
const pip = existsSync(join(venvDir, 'Scripts', 'pip.exe'))
  ? join(venvDir, 'Scripts', 'pip.exe')   // Windows
  : join(venvDir, 'bin', 'pip');           // Unix

const reqFile = join(root, 'backend', 'requirements.txt');
if (!existsSync(reqFile)) {
  console.warn(`${yellow('!')} backend/requirements.txt not found — skipping pip install.`);
} else {
  console.log(`${yellow('[2/2]')} Installing Python dependencies …`);
  execSync(`"${pip}" install -r "${reqFile}"`, { stdio: 'inherit', cwd: root });
  console.log(green('✓ Dependencies installed.\n'));
}

console.log(bold(green('✨ Backend setup complete! Run `npm run backend` to start.\n')));
