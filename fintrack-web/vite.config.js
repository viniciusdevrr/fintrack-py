import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.svg"],
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
        proxy: {
            // Evita problema de CORS em dev: tudo que começar com /api
            // é redirecionado para o backend FastAPI local.
            "/api": {
                target: "http://127.0.0.1:8000",
                changeOrigin: true,
                rewrite: function (path) { return path.replace(/^\/api/, ""); },
            },
        },
    },
});
