import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://Chaniug.github.io',
  base: '/chaniugv2/',
  outDir: './dist',
  compressHTML: true,
  scopedStyleStrategy: 'class',
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
