
/// <reference types="node" />

import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
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

  const outputsProxy = createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://127.0.0.1:3050",
    changeOrigin: true,
    on: {
      error: (err: any, req: any, res: any) => {
        console.error(`${red('[PROXY CRITICAL]')} Connection error for static outputs: ${err.message}`);
        if (res && !res.headersSent) {
          res.status(502).json({
            error: "Outputs Layer Unreachable",
            details: "The FastAPI backend is not responding.",
            message: err.message
          });
        }
      }
    }
  });

  const dashboardProxy = createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://127.0.0.1:3050",
    changeOrigin: true,
    pathRewrite: (path) => {
      if (path.startsWith('/folder') || path.startsWith('/neural-flow')) {
        return path;
      }
      return `/neural-flow${path}`;
    },
    on: {
      error: (err: any, req: any, res: any) => {
        console.error(`${red('[PROXY CRITICAL]')} Connection error for dashboard: ${err.message}`);
        if (res && !res.headersSent) {
          res.status(502).json({
            error: "Dashboard Layer Unreachable",
            details: "The FastAPI backend is not responding.",
            message: err.message
          });
        }
      }
    }
  });

  app.use('/api', apiProxy);
  app.use('/outputs', outputsProxy);
  app.use('/folder', dashboardProxy);
  app.use('/neural-flow', dashboardProxy);

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

    // Unified Service Prober
    const checkService = async (
      testFn: (signal: AbortSignal) => Promise<{ ok: boolean, status: string }>
    ) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await testFn(controller.signal);
        clearTimeout(timeoutId);
        return res;
      } catch (err: any) {
        if (err.name === 'AbortError' || (err.message && err.message.includes('aborted'))) {
          return { ok: false, status: "TIMEOUT" };
        }
        return { ok: false, status: `OFFLINE (${err.message || 'Error'})` };
      }
    };

    const fetchProbe = async (url: string, headers: HeadersInit, signal: AbortSignal) => {
      const response = await fetch(url, { headers, signal });
      return { ok: response.ok, status: response.ok ? "CONNECTED" : `AUTH ERROR (${response.status})` };
    };

    const sdkProbe = async (promise: Promise<any>) => {
      await promise;
      return { ok: true, status: "CONNECTED" };
    };

    const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // Run Probes Concurrently
    const [
      resGemini, resOpenAI, resAnthropic, resGroq,
      resSupabase, resFastAPI, resRunway, resElevenLabs, resHf
    ] = await Promise.all([
      geminiKey ? checkService(s => fetchProbe(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`, {}, s)) : Promise.resolve({ ok: false, status: "MISSING" }),
      openai ? checkService(s => sdkProbe(openai.models.list({ signal: s } as any))) : Promise.resolve({ ok: false, status: process.env.OPENAI_API_KEY ? "AUTH ERROR" : "MISSING" }),
      anthropic ? checkService(s => sdkProbe(anthropic.models.list({ signal: s } as any))) : Promise.resolve({ ok: false, status: process.env.ANTHROPIC_API_KEY ? "AUTH ERROR" : "MISSING" }),
      groq ? checkService(s => sdkProbe(groq.models.list({ signal: s } as any))) : Promise.resolve({ ok: false, status: process.env.GROQ_API_KEY ? "AUTH ERROR" : "MISSING" }),
      (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) 
        ? checkService(async (s) => {
            const start = Date.now();
            const r = await fetchProbe(`${process.env.VITE_SUPABASE_URL}/rest/v1/`, {
              'apikey': process.env.VITE_SUPABASE_ANON_KEY as string,
              'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
            }, s);
            if (r.ok) r.status = `CONNECTED (${Date.now() - start}ms)`;
            return r;
          })
        : Promise.resolve({ ok: false, status: (process.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_ANON_KEY) ? "CONFIGURATION INCOMPLETE" : "MISSING" }),
      checkService(async (s) => {
        const r = await fetch(`${BACKEND_URL}/health`, { signal: s }).catch(() => null);
        if (r && r.ok) {
          const json = await r.json().catch(() => null);
          return { ok: true, status: "ONLINE", detail: json && typeof json === 'object' ? `status=${json.status || 'ok'} version=${json.version || 'n/a'}` : "healthy" };
        }
        return { ok: false, status: "OFFLINE", detail: r ? `status=${r.status}` : "no connection" };
      }),
      process.env.RUNWAY_API_KEY 
        ? checkService(async (s) => {
            const r = await fetch("https://api.dev.runwayml.com/v1/organization", { headers: { 'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`, 'X-Runway-Version': '2024-11-06' }, signal: s });
            return { ok: r.status === 200, status: r.status === 200 ? "CONNECTED" : `AUTH ERROR (${r.status})` };
          }) 
        : Promise.resolve({ ok: false, status: "MISSING" }),
      process.env.ELEVENLABS_API_KEY ? checkService(s => fetchProbe("https://api.elevenlabs.io/v1/voices", { 'xi-api-key': process.env.ELEVENLABS_API_KEY as string }, s)) : Promise.resolve({ ok: false, status: "MISSING" }),
      process.env.HF_API_TOKEN ? checkService(s => fetchProbe("https://huggingface.co/api/whoami-v2", { 'Authorization': `Bearer ${process.env.HF_API_TOKEN}` }, s)) : Promise.resolve({ ok: false, status: "MISSING" }),
    ]);

    const activeProviders = [resGemini.ok, resOpenAI.ok, resAnthropic.ok, resGroq.ok].filter(Boolean).length;
    const configuredProviders = [geminiKey, process.env.OPENAI_API_KEY, process.env.ANTHROPIC_API_KEY, process.env.GROQ_API_KEY].filter(Boolean).length;

    // Core Services Check
    console.log("\n" + bold("--- SYSTEM INTEGRITY CHECK ---"));

    const printCheck = (name: string, status: string, isOk: boolean) => {
      const statusText = isOk ? green(status) : red(status);
      const symbol = isOk ? "✅" : "❌";
      console.log(`${symbol} ${name.padEnd(18)} : ${statusText}`);
    };

    printCheck("Node.js", nodeVersion, true);
    printCheck("Environment", envName, true);
    printCheck("Gemini", getMaskedStatus(resGemini.status, geminiKey), resGemini.ok);
    printCheck("OpenAI", getMaskedStatus(resOpenAI.status, process.env.OPENAI_API_KEY), resOpenAI.ok);
    printCheck("Anthropic", getMaskedStatus(resAnthropic.status, process.env.ANTHROPIC_API_KEY), resAnthropic.ok);
    printCheck("Groq", getMaskedStatus(resGroq.status, process.env.GROQ_API_KEY), resGroq.ok);
    printCheck("AI Providers", `${activeProviders}/4 active (${configuredProviders} configured)`, activeProviders > 0);
    printCheck("FastAPI", `${resFastAPI.status} (${(resFastAPI as any).detail})`, resFastAPI.ok);
    printCheck("Supabase API", getMaskedSupabase(resSupabase.status, process.env.VITE_SUPABASE_URL), resSupabase.ok);
    printCheck("Runway API", getMaskedStatus(resRunway.status, process.env.RUNWAY_API_KEY), resRunway.ok);
    printCheck("ElevenLabs API", getMaskedStatus(resElevenLabs.status, process.env.ELEVENLABS_API_KEY), resElevenLabs.ok);
    printCheck("Hugging Face", getMaskedStatus(resHf.status, process.env.HF_API_TOKEN), resHf.ok);

    if (resFastAPI.ok) {
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

// Only start the server automatically if we are not in a test environment and this is the main module
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { startServer };
