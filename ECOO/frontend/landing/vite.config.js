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
      // Add this line below to redirect lucide-react resolution to landing's node_modules
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react"),
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
