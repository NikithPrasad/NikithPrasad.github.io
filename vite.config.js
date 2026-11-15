import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // This is a GitHub user site, so it is served from the domain root.
  base: '/',
  plugins: [react(), tailwindcss()],
})
