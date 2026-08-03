import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Schemas per architecture doc §6.
 *
 * Two mechanical mappings from the doc's field list to Astro's content layer:
 *  - `slug`            → the filename (entry id). Required + unique is enforced
 *                        by the filesystem; Decap writes filename-from-slug in
 *                        Phase 2, so there is one source of truth, not two.
 *  - `longDescription` → the markdown body of the entry.
 * Everything else is 1:1 with the doc.
 */

// Exported so pages/components that need every category (category routes,
// filter pills, breadcrumbs) share this one list instead of re-deriving it
// from whatever products happen to exist.
export const CATEGORIES = [
  'hair',
  'jewelry',
  'accessories',
  'scarves',
  'apparel',
  'custom',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  hair: 'Hair',
  jewelry: 'Jewelry',
  accessories: 'Accessories',
  scarves: 'Scarves',
  apparel: 'Apparel',
  custom: 'Custom',
};

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.enum(CATEGORIES),
      price: z.number().nonnegative(),
      currency: z.string().default('USD'),
      // Required forever, not just Phase 1 — Etsy is permanent side-by-side
      // (decision #3). Phase 3 adds a second option; it never removes this.
      etsyUrl: z.string().url(),
      // Drives the per-page --accent/--accent-ink CSS variables (§7). When
      // unset, the page falls back to a rotating dye pool instead of a
      // fixed brand color — the accent is pulled from the cloth, not fixed.
      accent: z.object({ base: z.string(), deep: z.string() }).optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1), // quality floor + SEO (§7, §8)
            type: z.enum(['primary', 'onbody', 'detail']),
          })
        )
        .min(1),
      shortDescription: z.string().max(160),
      materials: z.string(),
      dimensions: z.string().optional(),
      care: z.string(),
      // Decision #2: stays unset until sourcing is verified with Saida.
      // Do not default or guess a region.
      fabricOrigin: z.string().optional(),
      patternName: z.string().optional(),
      isOneOfAKind: z.boolean().default(true),
      inStock: z.boolean().default(true),
      featured: z.boolean().default(false),
      collection: z.string().optional(), // fabric run / drop
      tags: z.array(z.string()).default([]),
      publishedAt: z.coerce.date(),
    }),
});

const craft = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/craft' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      coverImage: image(),
      publishedAt: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      relatedProducts: z.array(reference('products')).default([]),
    }),
});

// Manual at Phase 1 (§6) — copied from Etsy with attribution.
const reviews = defineCollection({
  loader: file('./src/content/reviews.json'),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    rating: z.number().min(1).max(5),
    sourceUrl: z.string().url(),
    date: z.coerce.date(),
  }),
});

export const collections = { products, craft, reviews };
