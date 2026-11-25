// @ts-check
import { defineConfig } from 'astro/config';

// Varsayılan: GitHub Pages (kullanıcı alan adı + repo adı alt yolu).
// Portföy sitesine kopyalanırken `npm run portfolio` SITE_URL ve SITE_BASE'i değiştirir.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://alperenesersu.github.io',
  base: process.env.SITE_BASE ?? '/SiberOkul',
  trailingSlash: 'always',
});
