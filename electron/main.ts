import { app, BrowserWindow, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from '../server.ts';

// Handle ES modules in Node
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

import { spawn } from 'child_process';

const isProd = app.isPackaged;

async function startBackend() {
  if (isProd) {
    // In production, the backend is a bundled executable in the resources folder
    const backendPath = path.join(process.resourcesPath, 'backend', 'backend_entry.exe');
    console.log(`Starting production backend at: ${backendPath}`);
    
    const backendProcess = spawn(backendPath, [], {
      env: { ...process.env, PORT: '3050' },
      windowsHide: true // Hide the console window on Windows
    });
    
    backendProcess.stdout.on('data', (data) => console.log(`[BACKEND] ${data}`));
    backendProcess.stderr.on('data', (data) => console.error(`[BACKEND ERROR] ${data}`));
    
    // Ensure backend is killed when electron exits
    app.on('will-quit', () => {
      backendProcess.kill();
    });
  } else {
    console.log('Development mode: Assuming backend is running via npm run backend');
  }
}

async function startApp() {
  console.log('Starting Anime Script Pro Orchestrator...');
  
  // Start the backend sidecar if in production
  await startBackend();
  
  try {
    const { app: serverApp } = await createServer();
    const PORT = Number(process.env.PORT) || 3000;
    
    serverApp.listen(PORT, 'localhost', () => {
      console.log(`Orchestrator running on http://localhost:${PORT}`);
      createWindow(PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    app.quit();
  }
}

function createWindow(port: string | number) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false, // Don't show until ready-to-show
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Anime Script Pro",
    backgroundColor: '#0a0a0a',
  });

  // Load the application
  mainWindow.loadURL(`http://localhost:${port}`);

  // Premium feel: only show when the page is loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.maximize();
  });

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron lifecycle
app.whenReady().then(startApp);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    startApp();
  }
});
