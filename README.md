# Blue Heron

Website for Blue Heron Sandwiches & Coffee House — a neighborhood sandwich
and coffee house in Magnolia, Seattle, open since 2005.

**Live:** [blueheronmagnolia.com](https://blueheronmagnolia.com)

Built with [Astro](https://astro.build). Ships as static HTML with **zero
JavaScript bundles** — the only script on the page is a few inline lines for
the "Open now" badge and the menu's category bar.

---

## Editing the site

You do not need to touch any code for the three things that change most often.

### Change a price, add a dish, reorder the menu

Everything on the menu page lives in **`src/data/menu.yaml`**.

```yaml
- name: Philly Cheese Steak
  image: philly-cheese-steak.jpg
  prices:
    - label: 6"
      amount: 11.99
    - label: 12"
      amount: 16.99
  ingredients: French roll bread, beef or chicken, grilled onion...
```

- **Price change** — edit the `amount` number. Don't type a `$`.
- **New dish** — copy an existing block and change the fields.
- **New photo** — drop the file into `src/assets/food/`, then put its
  filename in `image`. Resizing and format conversion happen automatically.
- **Reorder sections** — each section has an `order` number, counting up in
  tens so you can slot something new in between without renumbering.
- **Best sellers on the homepage** — set `featured: true` on an item.

> One YAML gotcha: `#` starts a comment. A name containing `#` must be
> quoted, e.g. `name: "Breakfast Sandwich #1"`.

### Change hours, phone, or address

All in **`src/data/site.ts`**. Editing `hours` there updates the footer, the
homepage, the live "Open now" badge, *and* the structured data Google reads
to show your hours in search results — all from that one place.

```ts
hours: {
  monday: { open: '07:00', close: '15:00' },
  // ...
  saturday: null,   // null means closed
}
```

### Change colors or fonts

All in **`src/styles/tokens.css`**. Nothing else in the codebase hardcodes a
color.

⚠️ The comments there note the contrast ratio of each color pair. If you
change a color, check it still clears **4.5:1** against its background
([contrast checker](https://webaim.org/resources/contrastchecker/)).
Two tokens — `--oak` and `--mist` — are marked decorative-only because they
fail that threshold; use them for borders and fills, never for text.

---

## Running it locally

```bash
npm install     # once
npm run dev     # http://localhost:4321, live-reloads as you edit
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with live reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built site, to check before deploying |
| `npm run check` | Type-check and validate the menu data |

If you mistype a field in `menu.yaml` the build fails with the exact line
rather than quietly shipping a broken menu.

---

## Deployment

Pushing to `main` deploys to **both** hosts:

- **Vercel** (primary) — builds automatically on push. Pull requests get their
  own preview URL. Rollback is one click in the dashboard.
- **GitHub Pages** (fallback) — via `.github/workflows/static.yml`.

The custom domain can only point at one host at a time. See the connection
steps and DNS records in the pull request description.

---

## Project layout

```
src/
  data/
    menu.yaml          ← the menu (edit this)
    site.ts            ← hours, address, phone, links (edit this)
  styles/
    tokens.css         ← colors, type scale, spacing (edit this)
    global.css         ← reset + shared utilities
  components/          ← header, footer, menu rows, photo frames
  layouts/Base.astro   ← the page shell, <head>, SEO
  pages/
    index.astro        ← homepage
    menu.astro         ← menu
    about.astro        ← our story
    404.astro
  assets/
    food/              ← dish photos
    place/             ← storefront, interior, poster wall, portraits
public/                ← files served as-is (favicon, robots.txt, CNAME)
```

---

## Notes on how it's built

- **Images** — Astro generates responsive WebP at multiple widths from the
  originals in `src/assets/`. Source photos are full-resolution; nothing that
  large is ever sent to a browser.
- **Fonts** — Fraunces (display) and Public Sans (body), self-hosted. No
  request ever leaves for a third-party font CDN.
- **Accessibility** — semantic HTML, real alt text on every image, visible
  keyboard focus, a skip link, and `prefers-reduced-motion` support.
- **SEO** — `Restaurant` structured data with hours, price range, phone and
  menu link, plus Open Graph tags and a sitemap.
