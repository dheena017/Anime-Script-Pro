# 🏛️ Studio Architect Guide: High-Fidelity Manual

Welcome to the internal engineering manifest for **Anime Script Pro**. This guide documents the underlying neural logic, cinematic design system, and modernized asynchronous backend that powers the studio.

---

## 🧠 Neural Synthesis Engine

The studio is powered by a multi-agent orchestration layer that manages the lifecycle of a production from a single prompt.

### 1. The Multimodal Pipeline (Image-to-Video)
Our "Production Ignition" loop follows a strict two-phase multimodal synthesis:
- **Phase 1: Visual DNA**: The engine uses the script's visual parameters to generate 4 high-fidelity storyboard frames via the `Imagen-3` protocol.
- **Phase 2: Motion Engine**: Once a frame is locked, the engine passes the image and cinematic prompts through the `Veo-2.0` protocol to synthesize a 5-second motion clip.

### 2. Autonomous World Lore
The world lore is generated using a "Consistency Matrix." The AI cross-references the `World Architect` data with every `Series Card` and `Script Scene` to ensure 100% narrative integrity.

---

## 🎨 Cinematic Design System: GOD MODE

We have evolved the UI from a simple prototype to a production-grade cinematic environment.

### Core Visual Principles:
- **Neural Pulse Animation**: Vertical connectors in the timeline visualize data flow via moving holographic pulses.
- **Cyber-Matrix Cards**: Production units use ultra-blurred glassmorphism (`backdrop-blur-3xl`) with shimmer-sweep hover effects.
- **Holographic Scanners**: Storyboard scenes feature active "laser-scan" highlights during the synthesis phase.
- **3D Typography**: High-impact headers with glowing studio accents for maximum focus.

---

## ⚙️ Modernized Backend Architecture

The Python/FastAPI backend has been fully modernized for high-concurrency studio production.

### Key Protocols:
- **Asynchronous Integrity**: 100% of API routers use `AsyncSession` to prevent database locks during heavy AI generation.
- **Absolute API Pathing**: All communication is standardized to `/api/` absolute paths for robust service discovery.
- **Non-Blocking Startup**: Metadata and table creation are handled via the `AsyncEngine` startup loop.
- **Real-Time Observability**: Integrated `Loguru` for granular monitoring of the AI synthesis lifecycle.
- **Detailed API Reference**: See the [API Documentation](./API_DOCUMENTATION.md) for endpoint specifications.

---

## 🛡️ Test Infrastructure Manifest

Our validation suite is organized into three specific technical sectors:

### 1. Unit & Integration (`backend/tests/`)
- `unit/`: Validates individual AI connectivity, REST protocols, and error handling.
- `integration/`: Tests the full production workflow from project creation to scene scaffolding.

### 2. Service Agents (`tests/backend_services/`)
- Audits the orchestration between different AI models and the integrity of data synchronization.

### 3. E2E Production Audit (`tests/e2e/`)
- **Playwright** suites that simulate real user production flows, ensuring that every button click in the "God Mode" loop works perfectly.

---

## 🚀 Deployment Standards

### Local Development
```bash
# Frontend
npm run dev

# Backend (Async Mode)
uvicorn backend.fastapi_app:app --reload --port 8080
```

### Production Build
```bash
docker compose up -d
```

---

<div align="center">
  <sub>Architected by the Anime Script Pro Engineering Team.</sub>
</div>
