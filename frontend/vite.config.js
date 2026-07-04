import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const firebaseAuthDomain = env.VITE_FIREBASE_AUTH_DOMAIN || 'devchat-dbfde.firebaseapp.com';

  return {
    plugins: [ react() ],
    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
      },
      proxy: {
        '/cdn': {
          target: 'https://unpkg.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cdn/, '')
        },
        '/__/auth': {
          target: `https://${firebaseAuthDomain}`,
          changeOrigin: true
        }
      }
    }
  }
})
