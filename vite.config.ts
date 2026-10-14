import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Stable font file names so they can be preloaded from index.html
        // (fonts are static — no cache-busting needed).
        assetFileNames: (info) => {
          const original = String(
            (info.originalFileNames && info.originalFileNames[0]) || info.name || '',
          )
          if (original.includes('.woff2')) return 'assets/fonts/[name][extname]'
          return 'assets/[name]-[hash][extname]'
        },
        // Code splitting: keep the heavy Three.js runtime in its own async chunk
        // so it never blocks first paint of the recruiter-facing content.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) {
            return 'three'
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'motion'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
})
