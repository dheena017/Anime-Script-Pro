import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const cyan = (text) => `\x1b[36m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const bold = (text) => `\x1b[1m${text}\x1b[0m`;

console.log(bold(cyan('\n🌌 ANIME SCRIPT PRO - FULL DESKTOP BUILD ENGINE\n')));

try {
  // 1. Build Frontend & Orchestrator
  console.log(`${yellow('[1/3]')} Building Frontend & Orchestrator...`);
  execSync('npm run build', { stdio: 'inherit' });
  console.log(green('✓ Frontend build complete.\n'));

  // 2. Build Python Backend
  console.log(`${yellow('[2/3]')} Bundling Python Backend (this may take a few minutes)...`);
  if (!fs.existsSync('build-backend')) {
    execSync('node scripts/ops/run-python.mjs -m PyInstaller --onedir --noconsole --add-data "backend/static;backend/static" --add-data "backend/templates;backend/templates" --distpath build-backend backend/backend_entry.py', { stdio: 'inherit' });
  } else {
    console.log(cyan('! build-backend already exists, skipping PyInstaller build. Delete it to rebuild.'));
  }
  console.log(green('✓ Backend bundle ready.\n'));

  // 3. Package with Electron Builder
  console.log(`${yellow('[3/3]')} Packaging Desktop Application...`);
  execSync('npx electron-builder', { stdio: 'inherit' });
  console.log(green('\n✨ SUCCESS! Your real desktop software is ready in dist-electron/\n'));

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
