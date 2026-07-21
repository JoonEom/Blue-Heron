// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blueheronmagnolia.com',

  integrations: [sitemap()],

  // Legacy /menu.html and /about.html redirects live ONLY in vercel.json,
  // deliberately. Two other approaches both break:
  //   - Astro `redirects` + format:'directory' emits dist/menu.html/ as a
  //     directory, colliding with the redirect file of the same name.
  //   - A static public/menu.html shadows the real /menu page, because
  //     static hosts resolve `menu.html` before `menu/index.html`.
  // Vercel serves the custom domain, so its 301s cover the indexed URLs.

  image: {
    // Every <Image> gets a responsive srcset + sizes by default.
    // "constrained" = scale down to fit the container, never upscale past the
    // original. This is what makes the 3000px source photos safe to ship.
    layout: 'constrained',
  },

  build: {
    // Emit /menu/index.html rather than /menu.html so URLs work identically
    // on Vercel and GitHub Pages without per-host rewrite rules.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  // No client-side router, no framework, no hydration: every page is static
  // HTML. The only JS that ships is the ~1KB inline nav/hours script.
  prefetch: false,

  devToolbar: { enabled: false },
});
