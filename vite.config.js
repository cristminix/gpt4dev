import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7000', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        chat: 'chat/index.html',
        pro: 'chat/pro.html',
        background: 'background.html',
        demo: 'demo.html',
        generate: 'generate.html',
        home: 'home.html',
        qrcode: 'qrcode.html'
      },
      external: ['mistral-tokenizer-js', 'llama-tokenizer-js']
    }
  },
  optimizeDeps: {
    // exclude: ['@huggingface/hub']
  },
  resolve: {
    alias: [
      // {
      //   find: '@huggingface/hub',
      //   replacement: 'https://cdn.jsdelivr.net/npm/@huggingface/hub@0.21.0/+esm'
      // }
    ]
  }
})