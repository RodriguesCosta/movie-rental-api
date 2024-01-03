import { zodSchema } from '@bebrasmell/zod-mongoose';

import { Lease } from '../../../entities/Lease.js';

export const LeaseSchema = zodSchema(Lease);

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
