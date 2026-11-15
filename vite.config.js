import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // This is a GitHub user site, so it is served from the domain root.
  base: '/',
  // The WebGL scene is a separate, scroll-triggered chunk (~135 KB gzipped).
  build: { chunkSizeWarningLimit: 600 },
  plugins: [react(), tailwindcss()],
})
