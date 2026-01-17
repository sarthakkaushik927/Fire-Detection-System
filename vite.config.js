import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // 🟢 This redirects your frontend calls to your backend server
      '/api': {
        target: 'https://keryptonite-8k3u.vercel.app', // 🟢 Use your actual backend URL here
        changeOrigin: true,
        secure: false,
      }
    }
  }
})