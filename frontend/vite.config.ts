import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        // Match backend: use 7067 for HTTPS profile, or 5077 for HTTP
        target: process.env.VITE_API_URL || "https://localhost:7067",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
