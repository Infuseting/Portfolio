import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// ── Projects Collection ──────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title:       z.string(),
    description: z.string(),
    tags:        z.array(z.string()).default([]),
    year:        z.number(),
    featured:    z.boolean().default(false),
    order:       z.number().default(99),       // display order (lower = first)
    liveUrl:     z.url().optional(),
    githubUrl:   z.url().optional(),
    coverImage:  image().optional(),
    coverAlt:    z.string().optional(),
    coverPresentation: z.enum(['logo', 'screenshot', 'photo']).default('screenshot'),
    coverCaption: z.string().optional(),
    gallery: z.array(z.object({
      image: image(),
      alt: z.string(),
      caption: z.string(),
      presentation: z.enum(['logo', 'screenshot', 'photo']).default('screenshot'),
    })).default([]),
    role:        z.string(),
    context:     z.string(),
    proof:       z.array(z.object({
      value: z.string(),
      label: z.string(),
    })).default([]),
    status:      z.enum(['live', 'wip', 'archived']).default('live'),
  }).refine((project) => Boolean(project.coverImage) === Boolean(project.coverAlt), {
    message: 'coverImage and coverAlt must be provided together',
  }).refine((project) => !project.featured || Boolean(project.coverImage), {
    message: 'Featured projects require a cover image',
  }),
});

// ── Journey Collection (professional experience + education) ────────────────
const journey = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/journey' }),
  schema: z.object({
    type:        z.enum(['experience', 'education']),
    title:       z.string(),
    organization:z.string(),
    location:    z.string().optional(),
    period:      z.string(),
    order:       z.number(),
    current:     z.boolean().default(false),
    tags:        z.array(z.string()).default([]),
    credential:  z.string().optional(),
  }),
});

// ── Certifications (optional, shown only when real entries exist) ───────────
const certifications = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/certifications' }),
  schema: ({ image }) => z.object({
    title: z.string().min(1),
    issuer: z.string().min(1),
    example: z.boolean().default(false),
    issued: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
    expires: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/).optional(),
    credentialId: z.string().optional(),
    verificationUrl: z.url().optional(),
    image: image().optional(),
    imageAlt: z.string().min(1).optional(),
    order: z.number().default(99),
  }).refine((entry) => Boolean(entry.image) === Boolean(entry.imageAlt), {
    message: 'image and imageAlt must be provided together',
  }).refine((entry) => entry.example || Boolean(entry.issued), {
    message: 'A real certification requires an issue date',
  }).refine((entry) => !entry.example || !(entry.credentialId || entry.verificationUrl || entry.expires), {
    message: 'An example cannot claim a credential ID, expiry date or verification URL',
  }),
});

// ── International internship brief ──────────────────────────────────────────
const internship = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/internship' }),
  schema: z.object({
    kicker: z.string(),
    title: z.string(),
    summary: z.string(),
    facts: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).length(3),
    contactLabel: z.string(),
    emailSubject: z.string(),
  }),
});

export const collections = { projects, journey, certifications, internship };
