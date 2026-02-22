import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Config for building the demo/docs app into docs/
// GitHub Pages serves from the docs/ folder on the main branch
export default defineConfig({
  plugins: [vue()],
  base: '/vue-month-picker/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
