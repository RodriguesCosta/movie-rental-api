import { moviesData } from '../../../../tests/moviesData.js';
import { MovieMemoryRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { GelAllMoviesService } from './GelAllMovies.service.js';

describe('GelAllMoviesService', () => {
  it('check if get all movies', async () => {
    const movieMemoryRepository = new MovieMemoryRepository();

    for (let index = 0; index < moviesData.length; index++) {
      if (index === moviesData.length - 1) {
        await movieMemoryRepository.create({
          ...moviesData[index],
          isAvailable: false,
        });
      } else {
        await movieMemoryRepository.create(moviesData[index]);
      }
    }

    const gelAllMoviesService = new GelAllMoviesService(movieMemoryRepository);

    const result = await gelAllMoviesService.execute();

    expect(result).toHaveProperty('movies');
    expect(result.movies.length).toBe(moviesData.length - 1);
  });
});
