import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown'
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        debug: true
      },
    }),
    react()
  ]
});