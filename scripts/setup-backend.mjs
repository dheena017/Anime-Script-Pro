import { spawnSync } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';

/**
 * Cross-platform Backend Setup for Anime Script Pro.
 */

const isWin = os.platform() === 'win32';
const backendDir = path.join(process.cwd(), 'backend');

console.log('🏗️  Starting Backend Setup...');

// 1. Detect Python
const pythonCmd = isWin ? 'python' : 'python3';
console.log(`🔍 Using Python command: ${pythonCmd}`);

// 2. Create Virtual Environment
console.log('📦 Creating Virtual Environment...');
const venvResult = spawnSync(pythonCmd, ['-m', 'venv', 'venv'], { 
  cwd: backendDir, 
  stdio: 'inherit',
  shell: true 
});

if (venvResult.status !== 0) {
  console.error('❌ Failed to create virtual environment.');
  process.exit(1);
}

// 3. Detect Pip Path
const pipPath = isWin 
  ? path.join(backendDir, 'venv', 'Scripts', 'pip.exe')
  : path.join(backendDir, 'venv', 'bin', 'pip');

console.log(`📥 Installing dependencies using: ${pipPath}`);

// 4. Install Requirements
const pipResult = spawnSync(pipPath, ['install', '-r', 'requirements.txt'], { 
  cwd: backendDir, 
  stdio: 'inherit',
  shell: true 
});

if (pipResult.status !== 0) {
  console.error('❌ Failed to install dependencies.');
  process.exit(1);
}

console.log('✅ Backend Setup Complete!');
