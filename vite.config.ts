import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

// Sur GitHub Pages, l'app est servie sous /<nom-du-repo>/ : BASE_PATH est injecté par la CI.
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    // Doit être déclaré avant le plugin React
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      // Génère favicon / icônes PWA / apple-touch-icon à partir du logo SVG
      pwaAssets: { image: 'public/logo.svg' },
      manifest: {
        name: 'Cissoufit',
        short_name: 'Cissoufit',
        description: 'Suivi de mes exercices de fitness',
        lang: 'fr',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
      },
      workbox: {
        // Pas de webmanifest ici : le plugin l'ajoute déjà au précache, et un doublon
        // fait échouer silencieusement le précache (service worker actif mais vide).
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // Le premier chargement est contrôlé tout de suite par le service worker
        clientsClaim: true,
      },
      devOptions: { enabled: false },
    }),
  ],
  test: {
    environment: 'happy-dom',
  },
})
