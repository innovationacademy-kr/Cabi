import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "/src") }],
  },
  server: {
    host: "0.0.0.0",
    port: 4242,
    strictPort: true,
    hmr: {
      port: 4242,
      clientPort: 4242,
      host: "localhost",
      path: "/hmr/",
    },
  },
});
