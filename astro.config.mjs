// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://blueheronmagnolia.com',

  integrations: [sitemap()],

  // The old site lived at /menu.html and /about.html. Those URLs are in
  // Google's index and in people's bookmarks, so they must keep working.
  // For a static build Astro emits a small redirect page for each, which
  // works on Vercel and GitHub Pages alike. vercel.json additionally turns
  // these into real 301s on the primary host.
  redirects: {
    '/index.html': '/',
    '/menu.html': '/menu',
    '/about.html': '/about',
  },

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
