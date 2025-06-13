import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
