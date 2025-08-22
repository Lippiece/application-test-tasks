import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { URL, fileURLToPath } from "node:url"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base   : "/application-test-tasks/",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
})
