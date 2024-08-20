// vite.config.ts
import svgr from "file:///Users/miyu/Documents/cabi/frontend/node_modules/@svgr/rollup/dist/index.js";
import react from "file:///Users/miyu/Documents/cabi/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import * as path from "path";
import { visualizer } from "file:///Users/miyu/Documents/cabi/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { defineConfig } from "file:///Users/miyu/Documents/cabi/frontend/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/Users/miyu/Documents/cabi/frontend";
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    visualizer({ open: true, gzipSize: true, template: "treemap" }),
    svgr()
  ],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__vite_injected_original_dirname, "src") }]
  },
  server: {
    host: "0.0.0.0",
    port: 4242,
    strictPort: true,
    hmr: {
      port: 4242,
      clientPort: 4242,
      host: "localhost",
      path: "/hmr/"
    }
  },
  test: {
    include: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWl5dS9Eb2N1bWVudHMvY2FiaS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21peXUvRG9jdW1lbnRzL2NhYmkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21peXUvRG9jdW1lbnRzL2NhYmkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5pbXBvcnQgc3ZnciBmcm9tIFwiQHN2Z3Ivcm9sbHVwXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCh7XG4gICAgICBiYWJlbDoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgXCJiYWJlbC1wbHVnaW4tc3R5bGVkLWNvbXBvbmVudHNcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHRydWUsXG4gICAgICAgICAgICAgIGZpbGVOYW1lOiBmYWxzZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgdmlzdWFsaXplcih7IG9wZW46IHRydWUsIGd6aXBTaXplOiB0cnVlLCB0ZW1wbGF0ZTogXCJ0cmVlbWFwXCIgfSksXG4gICAgc3ZncigpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFt7IGZpbmQ6IFwiQFwiLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmNcIikgfV0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgIHBvcnQ6IDQyNDIsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBobXI6IHtcbiAgICAgIHBvcnQ6IDQyNDIsXG4gICAgICBjbGllbnRQb3J0OiA0MjQyLFxuICAgICAgaG9zdDogXCJsb2NhbGhvc3RcIixcbiAgICAgIHBhdGg6IFwiL2htci9cIixcbiAgICB9LFxuICB9LFxuICB0ZXN0OiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgXCIqKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH1cIixcbiAgICAgIFwiKiovX190ZXN0c19fLyoue2pzLG1qcyxjanMsdHMsbXRzLGN0cyxqc3gsdHN4fVwiLFxuICAgIF0sXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogXCJqc2RvbVwiLFxuICAgIHNldHVwRmlsZXM6IFwiLi9zcmMvc2V0dXBUZXN0LnRzXCIsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLFlBQVksVUFBVTtBQUN0QixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUw3QixJQUFNLG1DQUFtQztBQVF6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixPQUFPO0FBQUEsUUFDTCxTQUFTO0FBQUEsVUFDUDtBQUFBLFlBQ0U7QUFBQSxZQUNBO0FBQUEsY0FDRSxhQUFhO0FBQUEsY0FDYixVQUFVO0FBQUEsWUFDWjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxFQUFFLE1BQU0sTUFBTSxVQUFVLE1BQU0sVUFBVSxVQUFVLENBQUM7QUFBQSxJQUM5RCxLQUFLO0FBQUEsRUFDUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTyxDQUFDLEVBQUUsTUFBTSxLQUFLLGFBQWtCLGFBQVEsa0NBQVcsS0FBSyxFQUFFLENBQUM7QUFBQSxFQUNwRTtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osS0FBSztBQUFBLE1BQ0gsTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLE1BQ1osTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsTUFDUDtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUEsRUFDZDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
