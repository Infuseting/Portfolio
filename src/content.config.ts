import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// ── Tags Collection ──────────────────────────────────────────────────────────
const tags = defineCollection({
  loader: file('src/data/tags.json'),
  schema: z.object({
    id: z.string(),
    name: z.union([z.string(), z.record(z.string(), z.string())]),
    icon: z.string(),
    color: z.string().optional(),
    category: z.union([z.string(), z.record(z.string(), z.string())]),
  }),
});

// ── Projects Collection ──────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title:       z.string(),
    description: z.string(),
    tags:        z.array(z.string()).default([]),
    year:        z.number(),
    featured:    z.boolean().default(false),
    order:       z.number().default(99),       // display order (lower = first)
    liveUrl:     z.string().url().optional(),
    githubUrl:   z.string().url().optional(),
    coverImage:  z.string().optional(),        // relative path in src/assets/
    coverAlt:    z.string().optional(),
    status:      z.enum(['live', 'wip', 'archived']).default('live'),
  }),
});

export const collections = { tags, projects };
