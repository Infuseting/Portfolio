// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

// Load .env variables directly into process.env for Astro builds
const env = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
Object.assign(process.env, env);

// https://astro.build/config
export default defineConfig({
  site: 'https://infuseting.fr',
  output: 'static',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    }
  },
  integrations: [sitemap(), mdx(), icon(), react()],
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