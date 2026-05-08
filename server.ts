
/// <reference types="node" />

import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import os from "os";
import fs from "fs";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

// ANSI Styling Utilities
const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
const gray = (text: string) => `\x1b[90m${text}\x1b[0m`;
const magenta = (text: string) => `\x1b[35m${text}\x1b[0m`;



export async function createServer() {
  const app = express();

  // --- Traffic Inspector Component ---
  const trafficLog: any[] = [];
  const logTraffic = (req: Request, status: number, duration: number) => {
    const size = req.headers['content-length'] || '0';
    trafficLog.unshift({
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`,
      size: `${(Number(size) / 1024).toFixed(2)}KB`,
      type: req.originalUrl.includes('/api/generate') ? 'NEURAL' : 'IO'
    });
    if (trafficLog.length > 20) trafficLog.pop();
  };

  // OpenAI Client
  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  // Anthropic Client
  const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  // Groq Client
  const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

  // AI Generation is now handled by the Python FastAPI backend for superior stability and fallback logic.
  // The Node.js handler has been retired.

  // --- Premium Request Logger Middleware ---
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode >= 400 ? red(res.statusCode.toString()) : green(res.statusCode.toString());
      console.log(`${gray(`[${new Date().toLocaleTimeString()}]`)} ${bold(req.method)} ${req.originalUrl} | ${status} | ${duration}ms`);
      logTraffic(req, res.statusCode, duration);
    });
    next();
  });

  // Python Backend Proxy (Phase 2 & 3 Migration)
  // Mounted at /api to handle all /api routes including /api/generate and auth routes.

  app.use('/api', createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://localhost:8080",
    changeOrigin: true,
    proxyTimeout: 90000,
    timeout: 90000,
    pathRewrite: (path) => {
      const rewritten = path.startsWith('/api') ? path : `/api${path}`;
      console.log('[PROXY DEBUG] rewrite:', path, '=>', rewritten);
      return rewritten;
    },
    on: {
      proxyReq: (proxyReq: any, req: any) => {
        // Detailed Proxy Logging
        if (process.env.DEBUG_PROXY === 'true' || process.env.NODE_ENV !== 'production') {
          console.log(`${magenta('[PROXY]')} >> ${bold(req.method)} ${req.originalUrl} -> ${proxyReq.path}`);
        }
        // Add a development bypass header when running locally to help developer login flows
        if (process.env.NODE_ENV !== 'production') {
          proxyReq.setHeader('x-bypass-auth', 'true');
        }
      },
      proxyRes: (proxyRes: any, req: any) => {
        if (process.env.DEBUG_PROXY === 'true' || process.env.NODE_ENV !== 'production') {
          const status = proxyRes.statusCode >= 400 ? red(proxyRes.statusCode.toString()) : green(proxyRes.statusCode.toString());
          console.log(`${magenta('[PROXY]')} << ${status} from ${req.originalUrl}`);
        }
      },
      error: (err: any, req: any, res: any) => {
        console.error(`${red('[PROXY CRITICAL]')} Connection error for ${req.originalUrl}: ${err.message}`);
        if (res && !res.headersSent) {
          res.status(502).json({
            error: "Intelligence Layer Unreachable",
            details: "The FastAPI backend is not responding. Please ensure it is running with 'npm run backend'.",
            message: err.message
          });
        }
      }
    }
  }));



  // --- MIGRATED ENDPOINTS ---
  // The following endpoints have been migrated to the FastAPI backend:
  // - /api/projects
  // - /api/world-lore
  // - /api/characters
  // - /api/sessions
  // - /api/episodes
  // - /api/scenes
  // - /api/categories
  // - /api/templates
  // - /api/stats/progress
  // - /api/prompt-library
  // They are now handled by the proxy defined above.
  // Note: Redundant handlers for projects, world-lore, characters, sessions, episodes, and scenes 
  // have been removed. They are now handled by the FastAPI proxy.
  // Vite middleware for development

  // --- Orchestrator Health Dashboard ---
  app.get('/_orchestrator/health', async (_req, res) => {
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
    const start = Date.now();
    let backendOnline = false;
    let latency = 0;

    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      backendOnline = response.ok;
      latency = Date.now() - start;
    } catch {
      backendOnline = false;
    }

    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      orchestrator: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        arch: process.arch,
        pid: process.pid
      },
      backend: {
        url: BACKEND_URL,
        status: backendOnline ? "ONLINE" : "OFFLINE",
        latency: backendOnline ? `${latency}ms` : 'N/A',
        stability: backendOnline ? (latency < 100 ? 'EXCELLENT' : 'DEGRADED') : 'CRITICAL'
      }
    });
  });

  app.get('/_orchestrator/traffic', (_req, res) => {
    res.json(trafficLog);
  });

  app.get('/_orchestrator/ai', (_req, res) => {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    res.json({
      ai: {
        openai: openai ? "CONNECTED" : (process.env.OPENAI_API_KEY ? "AUTH OK" : "MISSING API KEY"),
        anthropic: anthropic ? "CONNECTED" : (process.env.ANTHROPIC_API_KEY ? "AUTH OK" : "MISSING API KEY"),
        groq: groq ? "CONNECTED" : (process.env.GROQ_API_KEY ? "AUTH OK" : "MISSING API KEY"),
        backend: backendUrl,
        providerCount: [openai, anthropic, groq].filter(Boolean).length,
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), 'frontend'),
      configFile: path.resolve(process.cwd(), 'frontend/vite.config.ts'),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[UNCAUGHT ERROR]', err);
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? (err?.message || err) : undefined
    });
  });

  return { app, openai, anthropic, groq };
}

async function startServer() {
  const { app, openai, anthropic, groq } = await createServer();
  const PORT = Number(process.env.PORT) || 3000;
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

  app.listen(PORT, "0.0.0.0", async () => {
    // Using global styling utilities

    let pkg = { name: "Anime Script Pro", version: "1.0.0" };
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    } catch { }

    console.log("\n" + bold(cyan("================================================================")));
    console.log(bold(cyan(`   🌌 ${pkg.name.toUpperCase()} - v${pkg.version}`)));
    console.log(bold(cyan("================================================================")));

    console.log(`${bold("[STATUS]")} Orchestrator:  ${green(`Running on http://localhost:${PORT}`)}`);
    console.log(`${bold("[ENV]")}    Environment:   ${yellow(process.env.NODE_ENV || "development")}`);
    console.log(`${bold("[PORT]")}   Service Port:  ${PORT}`);

    // System Metrics Component
    const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const cpuLoad = os.loadavg()[0].toFixed(2);
    console.log(`${bold("[SYS]")}    Resources:     ${cyan(`${freeMem}GB/${totalMem}GB Free | CPU Load: ${cpuLoad}`)}`);

    let fastApiStatus = "UNKNOWN";
    let fastApiProbe = "No response";
    const nodeVersion = process.version;
    const envName = process.env.NODE_ENV || "development";
    const supabaseUrlStatus = process.env.VITE_SUPABASE_URL ? "READY" : "MISSING";
    const supabaseKeyStatus = process.env.VITE_SUPABASE_ANON_KEY ? "READY" : "MISSING";

    const aiProviders = [
      { name: "OpenAI", active: !!openai, envKey: !!process.env.OPENAI_API_KEY },
      { name: "Anthropic", active: !!anthropic, envKey: !!process.env.ANTHROPIC_API_KEY },
      { name: "Groq", active: !!groq, envKey: !!process.env.GROQ_API_KEY },
    ];
    const activeProviders = aiProviders.filter(p => p.active).length;
    const configuredProviders = aiProviders.filter(p => p.envKey).length;

    try {
      const response = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (response && response.ok) {
        fastApiStatus = "ONLINE";
        const json = await response.json().catch(() => null);
        fastApiProbe = json && typeof json === 'object'
          ? `status=${json.status || 'ok'} version=${json.version || 'n/a'}`
          : "healthy";
      } else {
        fastApiStatus = "OFFLINE";
        fastApiProbe = response ? `status=${response.status}` : "no connection";
      }
    } catch (error: any) {
      fastApiStatus = "OFFLINE";
      fastApiProbe = error?.message || "fetch failed";
    }

    // Core Services Check
    console.log("\n" + bold("--- SYSTEM INTEGRITY CHECK ---"));

    const check = (name: string, status: string, isOk: boolean) => {
      const statusText = isOk ? green(status) : red(status);
      const symbol = isOk ? "✅" : "❌";
      console.log(`${symbol} ${name.padEnd(18)} : ${statusText}`);
    };

    check("Node.js", nodeVersion, true);
    check("Environment", envName, true);
    check("OpenAI", openai ? "CONNECTED" : (process.env.OPENAI_API_KEY ? "AUTH OK" : "MISSING"), !!openai);
    check("Anthropic", anthropic ? "CONNECTED" : (process.env.ANTHROPIC_API_KEY ? "AUTH OK" : "MISSING"), !!anthropic);
    check("Groq", groq ? "CONNECTED" : (process.env.GROQ_API_KEY ? "AUTH OK" : "MISSING"), !!groq);
    check("AI Providers", `${activeProviders}/${aiProviders.length} active (${configuredProviders} configured)`, activeProviders > 0);
    check("FastAPI", `${fastApiStatus} (${fastApiProbe})`, fastApiStatus === "ONLINE");
    check("Supabase URL", supabaseUrlStatus, !!process.env.VITE_SUPABASE_URL);
    check("Supabase Key", supabaseKeyStatus, !!process.env.VITE_SUPABASE_ANON_KEY);

    if (fastApiStatus === "ONLINE") {
      console.log(`\n${bold(green("[SUCCESS]"))} Intelligence Layer verified at ${BACKEND_URL}`);
    } else {
      console.log(`\n${bold(red("[CRITICAL]"))} Intelligence Layer (FastAPI) is ${bold("OFFLINE")}`);
      console.log(yellow(`           Run: npm run backend`));
    }

    console.log(bold(cyan("================================================================")));
    console.log(`🚀 ${bold("PRODUCTION READY")} | Listening for incoming creative signals...`);
    console.log(`${gray("   Health: ")} http://localhost:${PORT}/_orchestrator/health`);
    console.log(`${gray("   Traffic: ")} http://localhost:${PORT}/_orchestrator/traffic`);
    console.log(bold(cyan("================================================================")) + "\n");
  });

  // --- Graceful Shutdown ---
  const shutdown = () => {
    console.log(`\n${yellow('[SHUTDOWN]')} Closing Orchestration Layer...`);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Only start the server automatically if we are not in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
