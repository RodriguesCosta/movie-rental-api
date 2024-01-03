import { Router } from 'express';

import { CreateLeaseService } from '../../services/CreateLease.service.js';
import { GelAllMoviesService } from '../../services/GelAllMovies.service.js';

export const moviesRouter = Router();

const gelAllMoviesService = new GelAllMoviesService();
const createLeaseService = new CreateLeaseService();

moviesRouter.get('/all', async (request, response) => {
  const { movies } = await gelAllMoviesService.execute();

  const returnMovies = movies.map((movie) => ({
    id: movie.id,
    name: movie.name,
    synopsis: movie.synopsis,
    rating: (movie.rating / 10).toFixed(1),
  }));

  response.json(returnMovies);
});

moviesRouter.post('/book', async (request, response) => {
  const { lease } = await createLeaseService.execute({
    movieId: request.body.movieId,
  });

  response.json({
    reserveId: lease.id,
    status: lease.status,
  });
});
