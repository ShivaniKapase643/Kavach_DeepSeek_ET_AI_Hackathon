import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F1A",
        panel: "#161D2E",
        "panel-raised": "#1F2942",
        "text-primary": "#F2F5FA",
        "text-muted": "#8794AC",
        danger: "#FF3B4E",
        warning: "#FFB020",
        safe: "#27D18C",
        accent: "#35C9E8",
        border: "#232C42",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "fade-slide-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-pop": {
          "0%": { transform: "scale(0.85)", opacity: "0.6" },
          "60%": { transform: "scale(1.06)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "border-pulse": {
          "0%, 100%": { boxShadow: "inset 0 0 60px 10px rgba(255,59,78,0.35)" },
          "50%": { boxShadow: "inset 0 0 120px 30px rgba(255,59,78,0.6)" },
        },
        wave: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 1.6s ease-in-out infinite",
        "fade-slide-in": "fade-slide-in 0.35s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "scale-pop": "scale-pop 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        shimmer: "shimmer 1.8s linear infinite",
        "border-pulse": "border-pulse 2.4s ease-in-out infinite",
        wave: "wave 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
