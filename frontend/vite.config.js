import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },

    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://backend:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: process.env.VITE_API_TARGET || 'http://backend:5000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});