import { randomUUID } from 'crypto';

import { AppError } from '../../../../utils/AppError.js';
import { Movie } from '../../entities/Movie.js';

export class MovieMemoryRepository {
  constructor() {
    this.data = [];
  }

  async create(movie) {
    const newMovie = await Movie.safeParseAsync({
      ...movie,
      id: randomUUID(),
    });

    if (!newMovie.success) {
      throw new AppError({
        message: 'Invalid movie data',
        messageCode: 'database.movie.invalidData',
        statusCode: 400,
      });
    }

    this.data.push(newMovie.data);

    return newMovie.data;
  }

  async findAvailable() {
    const result = this.data.filter((movie) => movie.isAvailable);

    return result;
  }

  async findById(id) {
    const movie = this.data.find((movie) => movie.id === id);

    return movie;
  }

  async update(id, movie) {
    const movieIndex = this.data.findIndex((movie) => movie.id === id);

    if (movieIndex === -1) {
      throw new AppError({
        message: 'movie not found',
        messageCode: 'database.movie.notFound',
        statusCode: 404,
      });
    }

    const newMovie = await Movie.safeParseAsync({
      ...movie,
      id,
    });

    if (!newMovie.success) {
      throw new AppError({
        message: 'Invalid movie data',
        messageCode: 'database.movie.invalidData',
        statusCode: 400,
      });
    }

    this.data[movieIndex] = newMovie.data;

    return newMovie.data;
  }
}
