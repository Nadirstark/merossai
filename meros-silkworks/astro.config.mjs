// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Meros Silkworks — static catalog site (§1.2).
// English ships at the root; the i18n block reserves the /[locale]/ shape
// so adding `uz` / `ru` in Phase 4 is additive, not a restructure (§1.4).
export default defineConfig({
  site: 'https://merossilkworks.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'], // Phase 4: ['en', 'uz', 'ru']
    routing: { prefixDefaultLocale: false },
  },
  image: {
    // Product photography is the only chroma on the page (§7) —
    // it goes through the asset pipeline for AVIF/WebP + dimensions (§8).
    responsiveStyles: true,
  },
});
