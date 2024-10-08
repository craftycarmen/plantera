// vite.config.js
import { defineConfig } from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslint from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/vite-plugin-eslint/dist/index.mjs";
import commonjs from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/vite-plugin-commonjs/dist/index.mjs";
import vitePluginRequire from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/vite-plugin-require/dist/index.js";
import requireTransform from "file:///Users/carmenshiu/Desktop/AppAcademyWork/plantera/frontend/node_modules/vite-plugin-require-transform/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    commonjs(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    }),
    vitePluginRequire.default(),
    requireTransform({})
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8000"
    },
    open: true
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvY2FybWVuc2hpdS9EZXNrdG9wL0FwcEFjYWRlbXlXb3JrL3BsYW50ZXJhL2Zyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvY2FybWVuc2hpdS9EZXNrdG9wL0FwcEFjYWRlbXlXb3JrL3BsYW50ZXJhL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jYXJtZW5zaGl1L0Rlc2t0b3AvQXBwQWNhZGVteVdvcmsvcGxhbnRlcmEvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZXNsaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCc7XG5pbXBvcnQgY29tbW9uanMgZnJvbSAndml0ZS1wbHVnaW4tY29tbW9uanMnO1xuaW1wb3J0IHZpdGVQbHVnaW5SZXF1aXJlIGZyb20gXCJ2aXRlLXBsdWdpbi1yZXF1aXJlXCI7XG5pbXBvcnQgcmVxdWlyZVRyYW5zZm9ybSBmcm9tICd2aXRlLXBsdWdpbi1yZXF1aXJlLXRyYW5zZm9ybSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNvbW1vbmpzKCksXG4gICAgZXNsaW50KHtcbiAgICAgIGxpbnRPblN0YXJ0OiB0cnVlLFxuICAgICAgZmFpbE9uRXJyb3I6IG1vZGUgPT09IFwicHJvZHVjdGlvblwiXG4gICAgfSksXG4gICAgdml0ZVBsdWdpblJlcXVpcmUuZGVmYXVsdCgpLFxuICAgIHJlcXVpcmVUcmFuc2Zvcm0oe30pLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiAnaHR0cDovL2xvY2FsaG9zdDo4MDAwJ1xuICAgIH0sXG4gICAgb3BlbjogdHJ1ZVxuICB9LFxuICBidWlsZDoge1xuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWVcbiAgICB9XG4gIH1cbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ1csU0FBUyxvQkFBb0I7QUFDN1gsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGNBQWM7QUFDckIsT0FBTyx1QkFBdUI7QUFDOUIsT0FBTyxzQkFBc0I7QUFJN0IsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxPQUFPO0FBQUEsTUFDTCxhQUFhO0FBQUEsTUFDYixhQUFhLFNBQVM7QUFBQSxJQUN4QixDQUFDO0FBQUEsSUFDRCxrQkFBa0IsUUFBUTtBQUFBLElBQzFCLGlCQUFpQixDQUFDLENBQUM7QUFBQSxFQUNyQjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxJQUNBLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxpQkFBaUI7QUFBQSxNQUNmLHlCQUF5QjtBQUFBLElBQzNCO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
