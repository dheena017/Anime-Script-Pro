import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv, UserConfigExport } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom Plugin for Studio Terminal Aesthetics
const StudioReporter = () => ({
  name: 'studio-reporter',
  configureServer(server: any) {
    server.httpServer?.once('listening', () => {
      const address = server.httpServer?.address();
      const port = typeof address === 'string' ? address : address?.port;
      setTimeout(() => {
        console.log('\n  \x1b[36m\x1b[1m[NEURAL LINK]\x1b[0m \x1b[32mStudio Interface synchronization complete.\x1b[0m');
        console.log(`  \x1b[90mAccess Point:\x1b[0m \x1b[35mhttp://localhost:${port}\x1b[0m\n`);
      }, 100);
    });
  },
});

// Vite configuration with improved type safety and comments
export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  // Helper to safely stringify env vars
  const envString = (key: string) => JSON.stringify(env[key] || '');

  return {
    root: __dirname,
    plugins: [react(), tailwindcss(), StudioReporter()],
    define: {
      'process.env.GEMINI_API_KEY': envString('GEMINI_API_KEY'),
      'import.meta.env.VITE_GEMINI_API_KEY': envString('VITE_GEMINI_API_KEY'),
      'process.env.OPENAI_API_KEY': envString('OPENAI_API_KEY'),
      'process.env.ANTHROPIC_API_KEY': envString('ANTHROPIC_API_KEY'),
      'process.env.HF_API_KEY': envString('HF_API_KEY'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      chunkSizeWarningLimit: 2000, // Increased for Studio heavy-lifting
      cssCodeSplit: true,
      reportCompressedSize: false, // Speed up builds
      rollupOptions: {
        output: {
          manualChunks: {
            'studio-core': ['react', 'react-dom', 'react-router-dom'],
            'studio-ai': ['@google/genai', 'openai', 'groq-sdk', '@anthropic-ai/sdk'],
            'studio-ui': ['lucide-react', 'motion', '@base-ui/react', 'framer-motion'],
            'studio-data': ['axios', '@tanstack/react-query', 'jspdf', 'jspdf-autotable'],
            'studio-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      include: ['lucide-react', 'motion', 'framer-motion'],
    },
  } satisfies UserConfigExport;
});

