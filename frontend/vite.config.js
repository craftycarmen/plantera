import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
// https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        esbuildCommonjs(['react-quilljs'])
      ]
    }
  },
  plugins: [
    react(),
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
