import { randomUUID } from 'crypto';

import { moviesData } from '../../../../tests/moviesData.js';
import { AppError } from '../../../utils/AppError.js';
import { LeaseMemoryRepository } from '../repositories/memory/LeaseMemoryRepository.js';
import { MovieMemoryRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { CreateLeaseService } from './CreateLease.service.js';

describe('CreateLeaseService', () => {
  let movieRepository;
  let leaseRepository;

  let createLeaseService;

  let movieNotAvailable;
  let movieAvailable;

  beforeEach(async () => {
    movieRepository = new MovieMemoryRepository();
    leaseRepository = new LeaseMemoryRepository();

    for (let index = 0; index < moviesData.length; index++) {
      if (index === moviesData.length - 1) {
        movieNotAvailable = await movieRepository.create({
          ...moviesData[index],
          isAvailable: false,
        });
      } else {
        movieAvailable = await movieRepository.create(moviesData[index]);
      }
    }

    createLeaseService = new CreateLeaseService({
      movieRepository,
      leaseRepository,
    });
  });

  it('it must be possible to make a reservation', async () => {
    const result = await createLeaseService.execute({
      movieId: movieAvailable.id,
    });

    expect(result).toHaveProperty('lease');
    expect(result.lease).toHaveProperty('movieId');
    expect(result.lease.movieId).toBe(movieAvailable.id);
    expect(result.lease.status).toBe('WAITING');

    const checkMovie = await movieRepository.findById(movieAvailable.id);

    expect(checkMovie.isAvailable).toBe(false);
  });

  it('It should not be possible to make a reservation for a film that is not available', async () => {
    await expect(
      createLeaseService.execute({
        movieId: movieNotAvailable.id,
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Movie not available',
        messageCode: 'service.movie.movieNotAvailable',
        statusCode: 400,
      }),
    );
  });

  it('It should not be possible to make a reservation for a film that does not exist', async () => {
    await expect(
      createLeaseService.execute({
        movieId: randomUUID(),
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Movie not found',
        messageCode: 'service.movie.movieNotFound',
        statusCode: 404,
      }),
    );
  });
});
