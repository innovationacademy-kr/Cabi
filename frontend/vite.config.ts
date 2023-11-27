/// <reference types="vitest" />
import svgr from "@svgr/rollup";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true, template: "treemap" }),
    svgr(),
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
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
  test: {
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts",
  },
});
