import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    build: {
      // A-Frame ocupa ~1,3 MB, pero va en su propio fragmento y solo se descarga
      // al entrar al Museo Virtual o a la ficha de un objeto.
      chunkSizeWarningLimit: 1400,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      // En desarrollo, /api se reenvía al backend para evitar CORS.
      proxy: {
        '/api': env.VITE_DEV_PROXY_TARGET ?? 'http://localhost:8000',
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: false,
    },
  }
})
