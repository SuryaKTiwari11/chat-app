import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add JSX runtime - this helps prevent 'React is not defined' errors
      jsxRuntime: "automatic",
      // This option processes all JS/JSX files in src/
      include: "./src/**/*.{js,jsx,ts,tsx}",
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react", "react-hot-toast"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
