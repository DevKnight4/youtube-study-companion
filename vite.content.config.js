import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/content.jsx'),
      output: {
        format: 'iife',
        entryFileNames: 'content.js',
      }
    }
  }
});
