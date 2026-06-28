// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://infuseting.fr',
  output: 'static',
  integrations: [sitemap(), mdx()],
  image: {
    // Use sharp for image optimization
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    css: {
      devSourcemap: true,
    },
  },
});