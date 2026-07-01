import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    dedupe: ['three'],
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        portfolio:  resolve(__dirname, 'portfolio.html'),
        experience: resolve(__dirname, 'experience.html'),
        services:   resolve(__dirname, 'services.html'),
        websites:   resolve(__dirname, 'websites.html'),
      },
    },
  },
})
