import { zodSchema } from '@bebrasmell/zod-mongoose';

import { Movie } from '../../../entities/Movie.js';

export const MovieSchema = zodSchema(Movie);

MovieSchema.index(
  {
    id: 1,
  },
  {
    unique: true,
  },
);
