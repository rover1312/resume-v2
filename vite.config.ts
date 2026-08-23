import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps the build portable for GitHub Pages project subpaths
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/three/') || id.includes('@react-three')) return 'three'
          if (
            id.includes('/react-dom/') ||
            id.includes('/react/') ||
            id.includes('framer-motion') ||
            id.includes('zustand') ||
            id.includes('lucide-react')
          ) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
})
