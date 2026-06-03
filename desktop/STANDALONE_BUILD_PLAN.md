# Plan: Creating Real Desktop Software

To provide a "real" standalone desktop experience, we need to package both the **Frontend (Node.js)** and the **Backend (Python)** into the same installer.

## Step 1: Frontend & Orchestrator Packaging
We are currently using `electron-builder`. This handles the React UI and the Node.js server.
- [x] Configure `electron-builder` in `package.json`.
- [x] Create distribution scripts.
- [ ] Optimize `main.ts` for production paths.

## Step 2: Backend (Python) Packaging
This is the critical step for "real" software. We will use `PyInstaller` to convert your FastAPI backend into a single `.exe` file.
- [ ] Create a `backend.spec` file for PyInstaller.
- [ ] Build the `backend.exe`.
- [ ] Move `backend.exe` into the Electron `resources` folder as a **Sidecar**.

## Step 3: Unified Launch
Modify `electron/main.ts` to automatically detect and launch the `backend.exe` when the app starts.

## Current Status
I am currently building a **Portable Version** (unpacked) to verify the UI and Node.js server work correctly as a desktop app.

---
### Next Steps
1. **Verify the Portable Build**: I will check the `dist-electron` folder once the current command finishes.
2. **Bundle Python**: I will need your permission to install `pyinstaller` and attempt to bundle the backend.
3. **Generate Installer**: Finally, I will run the full build to create `Anime-Script-Pro-Setup.exe`.
