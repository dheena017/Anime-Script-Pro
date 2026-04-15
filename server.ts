import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Multi-Model API Endpoint
  app.post("/api/generate", async (req, res) => {
    const { model, prompt, systemInstruction } = req.body;

    try {
      if (model.startsWith("gpt")) {
        if (!openai) throw new Error("OpenAI API Key not configured.");
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
        });
        return res.json({ text: response.choices[0].message.content });
      }

      if (model.startsWith("claude")) {
        if (!anthropic) throw new Error("Anthropic API Key not configured.");
        const response = await anthropic.messages.create({
          model: model,
          max_tokens: 4096,
          system: systemInstruction,
          messages: [{ role: "user", content: prompt }],
        });
        // @ts-ignore
        return res.json({ text: response.content[0].text });
      }

      if (model.includes("llama") || model.includes("mixtral") || model.includes("gemma")) {
        if (!groq) throw new Error("Groq API Key not configured.");
        const response = await groq.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
        });
        return res.json({ text: response.choices[0].message.content });
      }

      res.status(400).json({ error: "Unsupported or unconfigured model." });
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
