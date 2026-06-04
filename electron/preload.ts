import { contextBridge, ipcRenderer } from 'electron';

// Expose protected APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Add IPC methods here later
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});

console.log('Preload script loaded successfully.');
