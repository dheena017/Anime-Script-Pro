import uvicorn
import os
import sys
import multiprocessing

# This is required for PyInstaller + multiprocessing (if used by uvicorn)
if __name__ == '__main__':
    multiprocessing.freeze_support()

# Ensure the project root is in the path so 'backend.xxx' imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from backend.fastapi_app import app

def start():
    port = int(os.environ.get("PORT", 3050))
    print(f"🚀 Starting Standalone Backend on port {port}...")
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")

if __name__ == "__main__":
    start()
