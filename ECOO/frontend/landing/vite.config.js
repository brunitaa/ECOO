import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ecoo/ui": path.resolve(__dirname, "../shared/ui/src"),
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
      // Add this line to handle framer-motion for your shared components
      "framer-motion": path.resolve(__dirname, "./node_modules/framer-motion"),
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
    proxy: { "/api": { target: "http://localhost:3001", changeOrigin: true } },
  },
});
