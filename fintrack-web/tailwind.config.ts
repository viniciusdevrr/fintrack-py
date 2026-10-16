import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Paleta própria do FinTrack — tom "fintech premium",
        // inspirada em Linear/Stripe (fundo quase-preto azulado)
        // e Revolut (verde como cor de ação/positivo).
        base: {
          0: "#060709",
          1: "#0B0E14", // fundo da página (dark)
          2: "#12151C", // cards
          3: "#1A1E27", // cards elevados / hover
          4: "#242934", // bordas
        },
        brand: {
          50: "#FFFBEB",
          400: "#FF9B03",
          500: "#FF9B03", // Cor principal solicitada
          600: "#e28800",
          700: "#c57600",
        },
        danger: {
          400: "#F87171",
          500: "#EF4444",
        },
        warning: {
          400: "#FF9B03",
          500: "#F59E0B",
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.4), 0 0 0 1px rgb(255 255 255 / 0.04)",
        glow: "0 0 40px -10px rgba(16, 185, 129, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
