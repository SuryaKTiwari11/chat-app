/** @type {import('tailwindcss').Config} */
import tailgrids from "tailgrids/plugin";
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        gradient: "gradient 5s ease infinite",
        float: "float 6s ease-in-out infinite",
        pulse: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        "pulse-once": "pulse-once 2s ease-in-out forwards",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "subtle-bounce": "subtle-bounce 3s ease-in-out infinite",
        "hover-lift": "hover-lift 1.5s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-reveal": "scale-reveal 0.5s ease-out forwards",
        breath: "breath 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-once": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px 2px rgba(99, 102, 241, 0.4)" },
          "50%": { boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.7)" },
        },
        "subtle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "hover-lift": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-2px) scale(1.02)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-reveal": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        breath: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [tailgrids, daisyui],
  daisyui: {
    themes: [
      {
        "premium-dark": {
          primary: "#6366f1", // indigo-500
          "primary-content": "#ffffff", // white
          secondary: "#06b6d4", // cyan-500
          "secondary-content": "#ffffff", // white
          accent: "#9333ea", // purple-600
          "accent-content": "#ffffff", // white
          neutral: "#1e293b", // slate-800
          "neutral-focus": "#334155", // slate-700
          "neutral-content": "#f8fafc", // slate-50
          "base-100": "#0f172a", // slate-900
          "base-200": "#1e293b", // slate-800
          "base-300": "#334155", // slate-700
          "base-content": "#f8fafc", // slate-50
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
};
