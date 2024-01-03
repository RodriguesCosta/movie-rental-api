import { Router } from 'express';

import { Movie } from '../../entities/Movie.js';
import { GelAllMoviesService } from '../../services/GelAllMovies.service.js';

export const moviesRouter = Router();

const gelAllMoviesService = new GelAllMoviesService();

const movieDataReturn = Movie.pick({
  id: true,
  name: true,
  rating: true,
  synopsis: true,
});

moviesRouter.get('/all', async (request, response) => {
  const { movies } = await gelAllMoviesService.execute();

  const returnMovies = movies.map((movie) => movieDataReturn.parse(movie));

  response.json(returnMovies);
});
