import { z } from 'zod';

export const Lease = z.object({
  id: z.string().uuid(),
  movieId: z.string().uuid(),
  status: z.enum(['WAITING', 'LEASED', 'RETURNED']),
  customer: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .optional(),
  createdAt: z.date(),
});
