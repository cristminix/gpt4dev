import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: ["wahwei"],
 
    proxy: {
      "/api": {
        target: "http://localhost:7000", // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        // rewrite: (path) => path.replace(/^\/api/, ""), // Optional: Remove '/api' prefix
      },
      // "/llm": {
      //   target: "http://localhost:7000", // Backend server
      //   changeOrigin: true, // Ensure the request appears to come from the frontend server
      //   rewrite: (path) => path.replace(/^\/llm/, "/api/llm"), // Optional: Remove '/api' prefix
      // },
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
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks by package
          if (id.includes("node_modules")) {
            if (id.includes("marked")) {
              return "marked"
            }
            if (id.includes("turndown")) {
              return "turndown"
            }
            if (id.includes("bootstrap-icons")) {
              return "bootstrap-icons"
            }
            // Separate large libraries into their own chunks
            if (id.includes("@tiptap")) {
              return "editor"
            }
            if (id.includes("@preline") || id.includes("preline")) {
              return "preline"
            }
            if (id.includes("@fortawesome") || id.includes("bootstrap-icons")) {
              return "icons"
            }
            // Split more libraries to reduce vendor chunk size
            if (id.includes("react") || id.includes("react-dom")) {
              return "react"
            }
            if (id.includes("jquery") || id.includes("lodash")) {
              return "utils"
            }
            if (id.includes("svelte")) {
              return "svelte"
            }
            // Split highlight.js by language to reduce chunk size
            if (id.includes("highlight.js/lib/languages/javascript")) {
              return "highlight-js"
            }
            if (id.includes("highlight.js/lib/languages/python")) {
              return "highlight-py"
            }
            if (id.includes("highlight.js/lib/languages/go")) {
              return "highlight-go"
            }
            if (id.includes("highlight.js/lib/languages/html")) {
              return "highlight-html"
            }
            if (id.includes("highlight.js/lib/languages/css")) {
              return "highlight-css"
            }
            if (id.includes("highlight.js/lib/languages/rust")) {
              return "highlight-rust"
            }
            if (id.includes("highlight.js/lib/languages/java")) {
              return "highlight-java"
            }
            if (id.includes("highlight.js/lib/languages/cpp")) {
              return "highlight-cpp"
            }
            if (id.includes("highlight.js/lib/languages/json")) {
              return "highlight-json"
            }
            if (id.includes("highlight.js/lib/languages/sql")) {
              return "highlight-sql"
            }
            if (id.includes("highlight.js/lib/languages/typescript")) {
              return "highlight-ts"
            }
            if (id.includes("highlight.js/lib/languages/bash")) {
              return "highlight-bash"
            }
            if (id.includes("highlight.js/lib/languages/php")) {
              return "highlight-php"
            }
            if (id.includes("highlight.js/lib/languages/ruby")) {
              return "highlight-ruby"
            }
            if (id.includes("highlight.js/lib/languages/swift")) {
              return "highlight-swift"
            }
            if (id.includes("highlight.js/lib/languages/kotlin")) {
              return "highlight-kotlin"
            }
            if (id.includes("highlight.js/lib/languages/csharp")) {
              return "highlight-csharp"
            }
            if (id.includes("highlight.js/lib/languages/c")) {
              return "highlight-c"
            }
            if (id.includes("highlight.js/lib/languages/perl")) {
              return "highlight-perl"
            }
            if (id.includes("highlight.js/lib/languages/scala")) {
              return "highlight-scala"
            }
            if (id.includes("highlight.js/lib/languages/dart")) {
              return "highlight-dart"
            }
            if (id.includes("highlight.js/lib/languages/haskell")) {
              return "highlight-haskell"
            }
            if (id.includes("highlight.js/lib/languages/elixir")) {
              return "highlight-elixir"
            }
            if (id.includes("highlight.js/lib/languages/erlang")) {
              return "highlight-erlang"
            }
            if (id.includes("highlight.js/lib/languages/clojure")) {
              return "highlight-clojure"
            }
            if (id.includes("highlight.js/lib/languages/lua")) {
              return "highlight-lua"
            }
            // Group all other highlight.js languages into highlight-common
            if (id.includes("highlight.js")) {
              return "highlight-common"
            }
            // Group svelte-highlight into its own chunk
            if (id.includes("svelte-highlight")) {
              return "svelte-highlight"
            }
            // Group react-syntax-highlighter into its own chunk
            if (id.includes("react-syntax-highlighter")) {
              return "react-syntax-highlighter"
            }

            // Group all other node_modules into vendor chunk
            return "vendor"
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [svelte()],
})
