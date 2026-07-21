import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * The menu, loaded from a single YAML file.
 *
 * The schema below is not decoration — it runs at build time. If a price
 * is typed as text instead of a number, or an `id` is duplicated, or a
 * required field goes missing, the build fails with the exact line rather
 * than silently shipping a broken menu.
 */

const price = z.object({
  /** Size label, e.g. `6"` or `Half`. Omit when there's only one price. */
  label: z.string().optional(),
  amount: z.number().positive(),
});

const item = z.object({
  name: z.string(),
  /** Filename inside src/assets/food/ */
  image: z.string().optional(),
  ingredients: z.string().optional(),
  prices: z.array(price).optional(),
  /** Numbered options, e.g. the three Club Sub combinations. */
  variants: z.array(z.string()).optional(),
  /** Pulled out onto the homepage. */
  featured: z.boolean().default(false),
  /** Shows the "As seen on Seattle Refined" note. */
  press: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
});

const builderGroup = z.object({
  label: z.string(),
  options: z.string(),
});

const menu = defineCollection({
  loader: file('src/data/menu.yaml'),
  schema: z.object({
    /** Becomes the anchor id and the sticky-bar link target. */
    id: z.string(),
    /** Display order. getCollection() returns entries sorted by id, not
     *  file order, so without this the menu comes out alphabetical. */
    order: z.number(),
    title: z.string(),
    /** Short line under the section heading. */
    blurb: z.string().optional(),
    /** Rules or pricing that apply to the whole section. */
    note: z.string().optional(),
    /** Section-level photo, for sections without individual items. */
    image: z.string().optional(),
    items: z.array(item).optional(),
    /**
     * Names of items defined elsewhere in the file, pulled into this section.
     * Lets "Best Sellers" show the same dishes as Hot Sandwiches without
     * copying their prices, which would then need updating twice.
     */
    references: z.array(z.string()).optional(),
    /** The "build your own" choice groups. */
    builder: z.array(builderGroup).optional(),
  }),
});

export const collections = { menu };
