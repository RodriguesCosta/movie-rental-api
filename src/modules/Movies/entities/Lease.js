import { z } from 'zod';

export const LeaseCustomer = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
});

export const Lease = z.object({
  id: z.string().uuid(),
  movieId: z.string().uuid(),
  status: z.enum(['WAITING', 'LEASED', 'RETURNED']),
  customer: LeaseCustomer.optional(),
  createdAt: z.date(),
});
