import { getCollection } from 'astro:content';

/**
 * Loads the menu in display order and resolves any `references:` lists into
 * the real items they name.
 *
 * The point of the indirection: "Best Sellers" shows the same two sandwiches
 * that appear under Hot Sandwiches. Copying them would mean a price change
 * has to be made twice, and eventually the two copies disagree.
 */
export async function getMenu() {
  const sections = (await getCollection('menu')).sort(
    (a, b) => a.data.order - b.data.order
  );

  // Every item in the file, by name, so references can be looked up.
  const byName = new Map<string, any>();
  for (const s of sections) {
    for (const item of s.data.items ?? []) byName.set(item.name, item);
  }

  return sections.map((s) => {
    if (!s.data.references?.length) return s.data;

    const resolved = s.data.references.map((name) => {
      const hit = byName.get(name);
      if (!hit) {
        // Fail the build rather than silently rendering an empty section.
        throw new Error(
          `menu.yaml: section "${s.data.id}" references "${name}", ` +
            `but no item with that name exists. Available: ` +
            `${[...byName.keys()].join(', ')}`
        );
      }
      return hit;
    });

    return { ...s.data, items: resolved };
  });
}

/** Items flagged `featured: true`, used for the homepage highlights. */
export async function getFeatured() {
  const sections = await getMenu();
  const seen = new Set<string>();
  const out: any[] = [];
  for (const s of sections) {
    for (const item of s.items ?? []) {
      if (item.featured && !seen.has(item.name)) {
        seen.add(item.name);
        out.push(item);
      }
    }
  }
  return out;
}

/**
 * The lunch special for a given weekday, matched by the item names in the
 * "Daily Lunch Special" section (Monday, Tuesday, ...).
 */
export async function getLunchSpecials() {
  const sections = await getMenu();
  const section = sections.find((s) => s.id === 'lunch-special');
  return {
    note: section?.note ?? '',
    byDay: Object.fromEntries(
      (section?.items ?? []).map((i: any) => [i.name.toLowerCase(), i])
    ) as Record<string, any>,
  };
}
