<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/57cb8537-d0d7-40e7-a8d0-9e692147fe7c

## Run Locally

### Frontend (AI Studio App)
**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Start the frontend:
   ```
   npm run dev
   ```

### Backend
If you have a backend in the `backend/` folder, provide details or scripts for running it. (Currently, the folder is empty.)

### Database & Mathesar (Postgres Admin UI)
**Prerequisites:** Docker & Docker Compose

1. Navigate to the `mathesar` directory:
   ```
   cd mathesar
   ```
2. Start Mathesar and the database:
   ```
   docker compose -f docker-compose.yml up
   ```
   - This will start Mathesar, Postgres, and the Caddy reverse proxy.
   - Access Mathesar at http://localhost.
