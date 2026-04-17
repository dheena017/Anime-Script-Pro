<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Anime Script Pro

Anime Script Pro is a full-featured AI-powered studio for creating, managing, and collaborating on anime scripts. It provides a modern web interface for scriptwriting, storyboarding, character management, and more, powered by Gemini AI integration.

View your app in AI Studio: https://ai.studio/apps/57cb8537-d0d7-40e7-a8d0-9e692147fe7c

---

## ✨ Features

- AI-assisted scriptwriting and editing
- Storyboard and scene management
- Character and cast tools
- Library and collection management
- Community and tutorial sections
- Modular, scalable React + TypeScript codebase

---

## 📁 Folder Structure

```
Anime-Script-Pro/
├── components/           # Shared UI components (outside src)
├── dist/                 # Build output
├── src/                  # Main application source
│   ├── components/       # App-specific components (community, studio, etc.)
│   ├── contexts/         # React context providers
│   ├── data/             # Static and dynamic data
│   ├── hooks/            # Custom React hooks
│   ├── layouts/          # Layout components
│   ├── lib/              # Utility libraries
│   ├── pages/            # Page-level components/routes
│   └── services/         # API and service integrations
├── public/               # Static assets (if any)
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your environment variables (see below).
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root. Example:

```
GEMINI_API_KEY=your-gemini-api-key-here
```

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

## 📄 License

This project is licensed under the MIT License.
