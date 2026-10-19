import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    // Dev server — only active during `vite` (development)
    server: {
      port: 5173,
      // Proxy /api/* to local backend only when VITE_API_BASE_URL is empty (dev mode)
      proxy:
        !env.VITE_API_BASE_URL
          ? {
              '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
              },
            }
          : undefined,
    },

    // Production build output
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Chunk size warning threshold (kB)
      chunkSizeWarningLimit: 600,
    },

    // Make VITE_ env vars available in the app
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '2.0.0'),
    },
  };
});
