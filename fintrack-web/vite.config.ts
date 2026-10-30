import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// O celular só conversa com o Vite, e o Vite repassa /api para o FastAPI local.
const proxyApi = {
  "/api": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ""),
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "FinTrack — Finanças Pessoais",
        short_name: "FinTrack",
        description: "Controle e análise financeira pessoal",
        theme_color: "#0b0f19",
        background_color: "#0b0f19",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: proxyApi,
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: true,
    proxy: proxyApi,
  },
});