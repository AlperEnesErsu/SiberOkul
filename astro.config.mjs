// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages: site kullanıcı alan adında, repo adı alt yol olarak yayınlanır.
export default defineConfig({
  site: 'https://alperenesersu.github.io',
  base: '/SiberOkul',
  trailingSlash: 'always',
});
