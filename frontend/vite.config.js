import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import commonjs from 'vite-plugin-commonjs';
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    }),
    commonjs({
      filter(id) {
        if (id.includes('node_modules/react-quilljs/build-es')) {
          return true;
        }
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
    open: true
  }
}));
