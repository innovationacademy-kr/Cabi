/// <reference types="vitest" />
import {defineConfig, PluginOption} from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
import { visualizer } from 'rollup-plugin-visualizer'
export default defineConfig({
  plugins: [react(), visualizer({
    template: 'treemap',
    open:true,
    gzipSize:true,
    brotliSize: true,
    filename : 'analyse.html'
  }) as PluginOption],
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
