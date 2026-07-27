import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    proxy: {
      '/login': 'http://localhost:3000',
      '/register': 'http://localhost:3000',
      '/students': 'http://localhost:3000',
      '/upload': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/test': 'http://localhost:3000'
    }
  }
});
