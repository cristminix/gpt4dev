import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7000", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: Remove '/api' prefix
      },
      "/llm": {
        target: "http://localhost:5007", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        rewrite: (path) => path.replace(/^\/llm/, "/api/llm"), // Optional: Remove '/api' prefix
      },
      "/media": {
        target: "http://localhost:7000", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/media/, ""), // Optional: Remove '/api' prefix
      },
      "/thumbnail": {
        target: "http://localhost:7000", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/thumbnail/, ""), // Optional: Remove '/api' prefix
      },
    },
  },
  build: {
    minify: false,
    sourcemap: true,
    // rollupOptions: {
    //   input: {
    //     ["content-script-inject"]: path.resolve(__dirname, "src/content-scripts/content-inject.ts"),
    //   },
    // },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [svelte()],
})
