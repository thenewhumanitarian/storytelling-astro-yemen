import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown'
import react from "@astrojs/react";
import babelInlineScripts from "astro-babel-inline-scripts";

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
    sitemap(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        debug: true
      },
    }),
    react(),
    babelInlineScripts(
      {
        presets: [
          [
            "@babel/env",
            {
              targets: {
                browsers: ["> .5% or last 2 versions"],
              },
            },
          ],
        ],
      },
      (route) => {
        // Disable processing for index page.
        if (route === "/") {
          return false;
        }

        return true;
      }
    ),
  ]
});