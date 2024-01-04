import { randomUUID } from 'crypto';

import { AppError } from '../../../utils/AppError.js';
import { LeaseMemoryRepository } from '../repositories/memory/LeaseMemoryRepository.js';
import { MovieMemoryRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { ReturnMovieService } from './ReturnMovie.service.js';

describe('ReturnMovieService', () => {
  let leaseRepository;
  let movieRepository;
  let returnMovieService;

  beforeEach(async () => {
    leaseRepository = new LeaseMemoryRepository();
    movieRepository = new MovieMemoryRepository();

    returnMovieService = new ReturnMovieService({
      leaseRepository,
      movieRepository,
    });
  });

  async function createMovie() {
    const movieCreated = await movieRepository.create({
      name: 'Fake name',
      synopsis: 'Fake synopsis',
      rating: 33,
    });

    return movieCreated;
  }

  async function createLease(movieId = randomUUID()) {
    const leaseCreated = await leaseRepository.create({
      movieId,
      status: 'WAITING',
    });

    return leaseCreated;
  }

  it('It should be possible to return the film', async () => {
    const movieCreated = await createMovie();
    const leaseCreated = await createLease(movieCreated.id);

    await leaseRepository.update(leaseCreated.id, {
      status: 'LEASED',
    });

    const leaseReturned = await returnMovieService.execute({
      scheduleId: leaseCreated.id,
    });

    expect(leaseReturned).toHaveProperty('lease');
    expect(leaseReturned.lease).toHaveProperty('id');
    expect(leaseReturned.lease).toHaveProperty('status');
    expect(leaseReturned.lease.status).toBe('RETURNED');

    const movieUpdated = await movieRepository.findById(movieCreated.id);

    expect(movieUpdated.isAvailable).toBe(true);
  });

  it('It should not be possible to return a film that has not been confirmed', async () => {
    await expect(
      returnMovieService.execute({
        scheduleId: randomUUID(),
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Lease not found',
        messageCode: 'service.lease.leaseNotFound',
        statusCode: 404,
      }),
    );
  });

  it('It should not be possible to return a film that has already been returned or has not been confirmed', async () => {
    const movieCreated = await createMovie();
    const leaseCreated = await createLease(movieCreated.id);

    await expect(
      returnMovieService.execute({
        scheduleId: leaseCreated.id,
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Lease not confirmed',
        messageCode: 'service.lease.leaseNotConfirmed',
        statusCode: 400,
      }),
    );
  });
});
