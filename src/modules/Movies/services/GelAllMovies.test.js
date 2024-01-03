import { moviesData } from '../../../../tests/moviesData.js';
import { MovieMongooseRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { GelAllMoviesService } from './GelAllMovies.service.js';

describe('GelAllMoviesService', () => {
  it('check if get all movies', async () => {
    const movieMongooseRepository = new MovieMongooseRepository();

    for (let index = 0; index < moviesData.length; index++) {
      if (index === moviesData.length - 1) {
        await movieMongooseRepository.create({
          ...moviesData[index],
          isAvailable: false,
        });
      } else {
        await movieMongooseRepository.create(moviesData[index]);
      }
    }

    const gelAllMoviesService = new GelAllMoviesService(
      movieMongooseRepository,
    );

    const result = await gelAllMoviesService.execute();

    expect(result).toHaveProperty('movies');
    expect(result.movies.length).toBe(moviesData.length - 1);
  });
});
