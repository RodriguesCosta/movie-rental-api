import { moviesData } from '../../../../tests/moviesData.js';
import { MovieMemoryRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { CreateMovieService } from './CreateMovie.service.js';

describe('CreateMovieService', () => {
  it('should be able to create a film', async () => {
    const movieMemoryRepository = new MovieMemoryRepository();

    const createMovieService = new CreateMovieService(movieMemoryRepository);

    const result = await createMovieService.execute({
      ...moviesData[0],
    });

    expect(result).toHaveProperty('movie');
    expect(result.movie).toHaveProperty('id');
    expect(result.movie.name).toBe(moviesData[0].name);
  });
});
