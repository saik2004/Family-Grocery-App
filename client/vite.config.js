import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Family Grocery",
        short_name: "Grocery",
        description: "Mom's list, Dad's shopping",
        lang: "ta",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#F8FAF7",
        theme_color: "#166534",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Never cache API calls: Dad's list must always be live
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Product photos: cache after first load, so the grid is fast
            urlPattern: ({ url }) => /\/api\/products\/.+\/image$/.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "product-images",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});