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
