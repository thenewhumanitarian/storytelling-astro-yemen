import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// import prefetch from '@astrojs/prefetch';
// import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  // output: 'server',
  // adapter: vercel(),
  prefetch: {
    prefetchAll: true
  },
  integrations: [tailwind({
    applyBaseStyles: false
  })
});