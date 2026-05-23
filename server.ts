
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
      // Silence background health probes to keep developer terminal clean
      if (req.originalUrl !== '/_orchestrator/health') {
        const status = res.statusCode >= 400 ? red(res.statusCode.toString()) : green(res.statusCode.toString());
        console.log(`${gray(`[${new Date().toLocaleTimeString()}]`)} ${bold(req.method)} ${req.originalUrl} | ${status} | ${duration}ms`);
      }
      logTraffic(req, res.statusCode, duration);
    });
    next();
  });

  // Python Backend Proxy (Phase 2 & 3 Migration)
  // Mounted at /api to handle all /api routes including /api/generate and auth routes.
  const apiProxy = createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://127.0.0.1:3050",
    changeOrigin: true,
    // reduce proxy timeout to fail fast and return earlier errors to the client
    proxyTimeout: 600000,
    timeout: 600000,
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
  });

  app.use('/api', apiProxy);

  // WebSocket Proxy for Real-time Telemetry and Notifications
  const wsProxy = createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://127.0.0.1:3050",
    ws: true,
    changeOrigin: true,
    pathRewrite: (path) => {
      const rewritten = path.startsWith('/ws') ? path : `/ws${path}`;
      return rewritten;
    },
    on: {
      error: (err: any) => {
        console.error(`${red('[WS PROXY ERROR]')} WebSocket connection failure: ${err.message}`);
      }
    }
  });

  app.use('/ws', wsProxy);



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
    const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3050";
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
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:3050";
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
    // Serve static assets with a 1 day cache in production
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }));
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

  return { app, openai, anthropic, groq, wsProxy };
}

async function startServer() {
  const { app, openai, anthropic, groq, wsProxy } = await createServer();
  const PORT = Number(process.env.PORT) || 3000;
  const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3050";

  const server = app.listen(PORT, "0.0.0.0", async () => {
    // 1. Calculate active CPU usage percentage (necessary on Windows because os.loadavg() is always [0,0,0])
    const startMeasure = os.cpus().map(cpu => cpu.times);
    await new Promise(resolve => setTimeout(resolve, 150));
    const endMeasure = os.cpus().map(cpu => cpu.times);
    let totalDiff = 0;
    let idleDiff = 0;
    for (let i = 0; i < startMeasure.length; i++) {
      const start = startMeasure[i];
      const end = endMeasure[i];
      const totalStart = start.user + start.nice + start.sys + start.idle + start.irq;
      const totalEnd = end.user + end.nice + end.sys + end.idle + end.irq;
      totalDiff += totalEnd - totalStart;
      idleDiff += end.idle - start.idle;
    }
    const cpuLoadPercentage = totalDiff === 0 ? 0.0 : 100 * (1 - idleDiff / totalDiff);

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
    console.log(`${bold("[SYS]")}    Resources:     ${cyan(`${freeMem}GB Free of ${totalMem}GB | CPU Load: ${cpuLoadPercentage.toFixed(1)}%`)}`);

    const nodeVersion = process.version;
    const envName = process.env.NODE_ENV || "development";

    let openAiStatus = "MISSING";
    let openAiOk = false;
    let anthropicStatus = "MISSING";
    let anthropicOk = false;
    let groqStatus = "MISSING";
    let groqOk = false;
    let supabaseStatus = "MISSING";
    let supabaseOk = false;
    let fastApiStatus = "UNKNOWN";
    let fastApiProbe = "No response";

    const aiProviders = [
      { name: "OpenAI", envKey: !!process.env.OPENAI_API_KEY },
      { name: "Anthropic", envKey: !!process.env.ANTHROPIC_API_KEY },
      { name: "Groq", envKey: !!process.env.GROQ_API_KEY },
    ];

    const probePromises: Promise<any>[] = [];

    // OpenAI Real Authentication Check
    if (openai) {
      probePromises.push((async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          await openai.models.list({ signal: controller.signal } as any);
          clearTimeout(timeoutId);
          openAiStatus = "CONNECTED";
          openAiOk = true;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            openAiStatus = "TIMEOUT";
          } else {
            openAiStatus = `AUTH ERROR (${err.status || err.message || 'Key invalid'})`;
          }
        }
      })());
    } else if (process.env.OPENAI_API_KEY) {
      openAiStatus = "AUTH ERROR";
    }

    // Anthropic Real Authentication Check
    if (anthropic) {
      probePromises.push((async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          await anthropic.models.list({ signal: controller.signal } as any);
          clearTimeout(timeoutId);
          anthropicStatus = "CONNECTED";
          anthropicOk = true;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            anthropicStatus = "TIMEOUT";
          } else {
            anthropicStatus = `AUTH ERROR (${err.status || err.message || 'Key invalid'})`;
          }
        }
      })());
    } else if (process.env.ANTHROPIC_API_KEY) {
      anthropicStatus = "AUTH ERROR";
    }

    // Groq Real Authentication Check
    if (groq) {
      probePromises.push((async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          await groq.models.list({ signal: controller.signal } as any);
          clearTimeout(timeoutId);
          groqStatus = "CONNECTED";
          groqOk = true;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            groqStatus = "TIMEOUT";
          } else {
            groqStatus = `AUTH ERROR (${err.status || err.message || 'Key invalid'})`;
          }
        }
      })());
    } else if (process.env.GROQ_API_KEY) {
      groqStatus = "AUTH ERROR";
    }

    // Supabase Real Authentication Check
    if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
      probePromises.push((async () => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const start = Date.now();
          const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/`, {
            headers: {
              'apikey': process.env.VITE_SUPABASE_ANON_KEY || "",
              'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY || ""}`
            },
            signal: controller.signal
          }).catch(() => null);
          clearTimeout(timeoutId);
          if (response && response.ok) {
            supabaseStatus = `CONNECTED (${Date.now() - start}ms)`;
            supabaseOk = true;
          } else {
            supabaseStatus = `AUTH ERROR (status: ${response ? response.status : 'No response'})`;
          }
        } catch (err: any) {
          if (err.name === 'AbortError') {
            supabaseStatus = "TIMEOUT";
          } else {
            supabaseStatus = `OFFLINE (${err.message || 'Connection failed'})`;
          }
        }
      })());
    } else if (process.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_ANON_KEY) {
      supabaseStatus = "CONFIGURATION INCOMPLETE";
    }

    // FastAPI Real Health Check
    probePromises.push((async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const response = await fetch(`${BACKEND_URL}/health`, { signal: controller.signal }).catch(() => null);
        clearTimeout(timeoutId);
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
        fastApiProbe = error?.name === 'AbortError' ? "timeout" : (error?.message || "fetch failed");
      }
    })());

    // Wait for all checks to complete concurrently (maximum 2 seconds delay)
    await Promise.all(probePromises);

    const activeProviders = [openAiOk, anthropicOk, groqOk].filter(Boolean).length;
    const configuredProviders = aiProviders.filter(p => p.envKey).length;

    // Smart Key Masking helper
    const getMaskedStatus = (status: string, key: string | undefined) => {
      if (status === "CONNECTED" && key) {
        if (key.length <= 8) return `${status} (INVALID)`;
        
        let prefix = "";
        let cleanKey = key;
        
        if (key.startsWith("sk-proj-")) {
          prefix = "sk-proj-";
          cleanKey = key.slice(8);
        } else if (key.startsWith("sk-ant-")) {
          prefix = "sk-ant-";
          cleanKey = key.slice(7);
        } else if (key.startsWith("gsk_")) {
          prefix = "gsk_";
          cleanKey = key.slice(4);
        } else if (key.startsWith("sk-")) {
          prefix = "sk-";
          cleanKey = key.slice(3);
        }
        
        const visiblePrefix = prefix + cleanKey.substring(0, 3);
        const visibleSuffix = cleanKey.substring(cleanKey.length - 4);
        return `${status} (${visiblePrefix}...${visibleSuffix})`;
      }
      return status;
    };

    // Smart URL Masking helper for Supabase
    const getMaskedSupabase = (status: string, url: string | undefined) => {
      if (status.startsWith("CONNECTED") && url) {
        try {
          const parsed = new URL(url);
          const parts = parsed.hostname.split('.');
          const host = parts[0];
          const maskedHost = host.length > 8 
            ? `${host.substring(0, 4)}...${host.substring(host.length - 4)}`
            : `${host.substring(0, 2)}...`;
          const domain = parts.slice(1).join('.');
          return `${status} (${parsed.protocol}//${maskedHost}.${domain})`;
        } catch {
          return `${status} (${url.substring(0, 15)}...)`;
        }
      }
      return status;
    };

    // Core Services Check
    console.log("\n" + bold("--- SYSTEM INTEGRITY CHECK ---"));

    const check = (name: string, status: string, isOk: boolean) => {
      const statusText = isOk ? green(status) : red(status);
      const symbol = isOk ? "✅" : "❌";
      console.log(`${symbol} ${name.padEnd(18)} : ${statusText}`);
    };

    check("Node.js", nodeVersion, true);
    check("Environment", envName, true);
    check("OpenAI", getMaskedStatus(openAiStatus, process.env.OPENAI_API_KEY), openAiOk);
    check("Anthropic", getMaskedStatus(anthropicStatus, process.env.ANTHROPIC_API_KEY), anthropicOk);
    check("Groq", getMaskedStatus(groqStatus, process.env.GROQ_API_KEY), groqOk);
    check("AI Providers", `${activeProviders}/${aiProviders.length} active (${configuredProviders} configured)`, activeProviders > 0);
    check("FastAPI", `${fastApiStatus} (${fastApiProbe})`, fastApiStatus === "ONLINE");
    check("Supabase API", getMaskedSupabase(supabaseStatus, process.env.VITE_SUPABASE_URL), supabaseOk);

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

  // Handle WebSocket upgrades for real-time telemetry and notifications
  server.on('upgrade', (req, socket, head) => {
    if (req.url?.startsWith('/ws')) {
      (wsProxy as any).upgrade(req, socket, head);
    }
  });

  // --- Graceful Shutdown ---
  const shutdown = () => {
    console.log(`\n${yellow('[SHUTDOWN]')} Closing Orchestration Layer...`);
    try {
      server.close();
    } catch {}
    
    // Exit immediately after 150ms to allow logs to flush without waiting for Keep-Alive sockets
    setTimeout(() => {
      process.exit(0);
    }, 150);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Only start the server automatically if we are not in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
