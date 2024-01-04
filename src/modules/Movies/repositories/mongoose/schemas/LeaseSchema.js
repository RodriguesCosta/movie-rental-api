import { zodSchema } from '@bebrasmell/zod-mongoose';
import { z } from 'zod';

import { Lease } from '../../../entities/Lease.js';

const mongoLease = Lease.extend({
  customer: z
    .object({
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
});

export const LeaseSchema = zodSchema(mongoLease);

LeaseSchema.index(
  {
    id: 1,
  },
  {
    unique: true,
  },
);

LeaseSchema.index({
  createdAt: 1,
});

LeaseSchema.index({
  status: 1,
});

LeaseSchema.index({
  movieId: 1,
});
