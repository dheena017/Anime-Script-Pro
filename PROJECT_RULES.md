# Project Directory Rules

These rules dictate how files and code should be organized in the `Anime-Script-Pro` project. **AI Assistants must strictly follow these structural guidelines:**

## Directory Segregation
1. **Backend**: ALL backend code (Python, FastAPI, databases, AI engine, scripts for the backend) MUST be placed inside the `backend/` directory. No backend files should be created in the root directory.
2. **Frontend**: ALL frontend code (React, TypeScript, CSS, UI components, pages) MUST be placed inside the `frontend/` directory.
3. **Scripts**: General project maintenance or setup scripts should go into the `scripts/` directory.
4. **Docs**: Documentation and markdown guides should go into the `docs/` directory.

## Strict Enforcement
- Do not mix frontend and backend dependencies or code.
- If you are asked to create a new feature, automatically route the files to their respective domain folders. For example, a new API endpoint goes to `backend/api/`, and a new UI page goes to `frontend/src/pages/`.
- Do not create scratch files or random python scripts in the project root unless absolutely necessary for root-level configuration.
