import { Router } from 'express';

import { CreateLeaseService } from '../../services/CreateLease.service.js';
import { CreateMovieService } from '../../services/CreateMovie.service.js';
import { GelAllMoviesService } from '../../services/GelAllMovies.service.js';

export const moviesRouter = Router();

const createMovieService = new CreateMovieService();
const gelAllMoviesService = new GelAllMoviesService();
const createLeaseService = new CreateLeaseService();

moviesRouter.post('/movie', async (request, response) => {
  const { movie } = await createMovieService.execute(request.body);

  response.status(201).json({
    movie,
  });
});

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

  response.status(201).json({
    reserveId: lease.id,
    status: lease.status,
  });
});
