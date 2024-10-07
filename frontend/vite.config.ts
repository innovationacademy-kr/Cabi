/// <reference types="vitest" />
import svgr from "@svgr/rollup";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recoil")) {
              return "recoil"; // Recoil 라이브러리를 recoil 청크로 분리
            }
            if (id.includes("@sentry")) {
              return "sentry"; // Sentry 라이브러리를 sentry 청크로 분리
            }
            return "vendor"; // 나머지 외부 라이브러리를 vendor 청크로 분리
          }
          if (id.includes("Admin")) {
            return "admin"; // Admin 관련 모듈을 분리
          }
        },
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: false,
            },
          ],
        ],
      },
    }),
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
