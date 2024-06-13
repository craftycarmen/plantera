import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import commonjs from 'vite-plugin-commonjs';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({
  optimizeDeps: {
    exclude: ['react-quilljs']
  },
  plugins: [
    react(),
    commonjs(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
    open: true
  }
}));
