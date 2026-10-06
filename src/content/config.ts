import { defineCollection, z } from 'astro:content';

const briefings = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    sourcesEvaluated: z.number().default(8),
    confidenceScore: z.number().min(0).max(1),
    summary: z.string().optional(),
    themes: z.array(
      z.object({
        name: z.string(),
        delta7d: z.enum(['accelerating', 'stable', 'decelerating']),
        summary: z.string(),
        tags: z.array(z.string()),
        primarySources: z.array(
          z.object({
            title: z.string(),
            url: z.string().url(),
          })
        ),
      })
    ),
  }),
});

export const collections = { briefings };
