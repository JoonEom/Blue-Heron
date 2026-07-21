import type { ImageMetadata } from 'astro';

/**
 * Bridges the gap between "a filename written in menu.yaml" and "an image
 * Astro can optimize".
 *
 * Astro only optimizes images it can see as real imports at build time, so a
 * bare string from YAML isn't enough. `import.meta.glob` with `eager: true`
 * imports the whole folder up front and lets us look a file up by name.
 *
 * The practical effect: adding a photo is dropping a file in the folder and
 * naming it in the YAML. No import statement to remember.
 */

const food = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/food/*.{jpg,jpeg,png,webp,avif,JPG,JPEG}',
  { eager: true }
);

const place = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/place/*.{jpg,jpeg,png,webp,avif,JPG,JPEG}',
  { eager: true }
);

function lookup(
  map: Record<string, { default: ImageMetadata }>,
  dir: string,
  name?: string
): ImageMetadata | undefined {
  if (!name) return undefined;
  const hit = map[`/src/assets/${dir}/${name}`];
  if (!hit) {
    // Loud in dev, harmless in prod: a typo'd filename shows up immediately
    // instead of silently rendering a gap where a photo should be.
    console.warn(
      `[images] No file named "${name}" in src/assets/${dir}/. ` +
        `Available: ${Object.keys(map)
          .map((k) => k.split('/').pop())
          .join(', ')}`
    );
    return undefined;
  }
  return hit.default;
}

export const foodImage = (name?: string) => lookup(food, 'food', name);
export const placeImage = (name?: string) => lookup(place, 'place', name);
