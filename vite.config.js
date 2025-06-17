import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteStaticCopy({
    targets: [
      {
        src: 'manifest.json',
        dest: '.' // copy to /dist folder
      }
    ]
  }), flowbiteReact()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        group: 'group.html'
      }
    }
  }
})