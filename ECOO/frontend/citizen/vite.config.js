import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      "@ecoo/ui": path.resolve(__dirname, "../shared/ui/src"),
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion"),
      // Fixes the current BarChartPanel build error
      "recharts": path.resolve(__dirname, "./node_modules/recharts"),
      // Safely aliases react basics to prevent any hidden duplication issues
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5170,
    proxy: { "/api": { target: "https://ecoo-backend.onrender.com", changeOrigin: true } },
  },
});
