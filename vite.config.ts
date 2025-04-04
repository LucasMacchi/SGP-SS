import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
const manifestIcons = [
  {
    src: '/logo_small.webp',
    sizes: '192x192',
    type: 'image/png',
  }
]

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sistema Gestor de Pedidos',
        short_name: 'SGP app',
        icons: manifestIcons,
      }
    })
  ],
})
