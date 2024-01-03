import { z } from 'zod';

export const Movie = z.object({
  id: z.string().uuid(),
  name: z.string(),
  synopsis: z.string(),
  rating: z.number().int().min(0).max(50),
  isAvailable: z.boolean().default(true),
});
