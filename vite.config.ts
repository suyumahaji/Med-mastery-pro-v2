import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files or system env (GitHub Actions)
  const env = loadEnv(mode, process.cwd(), '');
  
  // Support both standard names used in different environments
  const apiKey = env.API_KEY || env.GEMINI_API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    base: './', // CRITICAL: Ensures files load correctly inside an APK or static host
    define: {
      // Injects the API_KEY into the code globally
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    server: {
      port: 3000,
      host: true
    }
  };
});