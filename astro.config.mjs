import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown'
import react from "@astrojs/react";
import babelScripts from "astro-babel";


// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  redirects: {
    '/en': '/en/grid',
    '/ar': '/ar/grid',
    '/': '/en/grid',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    babelScripts({
      presets: [
        ['minify', {
          builtIns: false,
          evaluate: false,
          mangle: false,
        }],
        ["@babel/preset-env", {
          "modules": false
        }]
      ]
    }),
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        debug: true
      },
    }),
    react(),
  ]
});