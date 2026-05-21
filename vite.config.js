import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: ''` produces relative asset URLs in the built index.html, which is
// required for Capacitor (the app loads files via capacitor:// or file:// in
// the native container). It's also fine for Vercel.
export default defineConfig({
  plugins: [react()],
  base: '',
  build: {
    target: 'es2019',
    chunkSizeWarningLimit: 4000, // venues.json is ~3MB on first import
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/data/venues.json'))     return 'venues';
          if (id.includes('src/data/recipes.json'))    return 'recipes';
          if (id.includes('src/data/categories.json')) return 'categories';
        },
      },
    },
  },
})
