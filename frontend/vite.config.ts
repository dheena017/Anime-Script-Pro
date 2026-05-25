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
      chunkSizeWarningLimit: 1500,
      cssCodeSplit: true,
      reportCompressedSize: false, // Speed up builds
      assetsInlineLimit: 4096,    // Only inline assets < 4KB
      rollupOptions: {
        output: {
          // Manual chunks — only libraries that can be independently separated
          // Note: react, react-dom, openai, anthropic, groq are statically co-imported
          // with app code so Rollup cannot split them (they become empty if declared).
          manualChunks: {
            // Router — loaded once, cached long-term
            'vendor-router': ['react-router-dom'],

            // Google AI SDK — largest standalone AI dep (~289KB)
            'ai-google': ['@google/genai'],

            // UI icon library — heavy but tree-shakeable per route
            'ui-icons': ['lucide-react'],

            // Animation runtimes — route-independent, large
            'ui-motion': ['motion', 'framer-motion'],

            // Base UI headless components
            'ui-base': ['@base-ui/react'],

            // Data layer
            'data-query': ['@tanstack/react-query'],
            'data-http': ['axios'],
            'data-pdf': ['jspdf', 'jspdf-autotable'],

            // Tiny CSS utility belt
            'studio-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          },
          // Deterministic hashed filenames for long-term caching
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      // Enable HMR so frontend code changes apply live without manual reload
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      },
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3050',
          changeOrigin: true,
          secure: false,
        },
        '/outputs': {
          target: 'http://127.0.0.1:3050',
          changeOrigin: true,
          secure: false,
        },
        '/ws': {
          target: 'ws://127.0.0.1:3050',
          ws: true,
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

