import { LeaseMemoryRepository } from '../repositories/memory/LeaseMemoryRepository.js';
import { MovieMemoryRepository } from '../repositories/memory/MovieMemoryRepository.js';
import { ResetOldLeaseService } from './ResetOldLease.service.js';

describe('ResetOldLeaseService', () => {
  let leaseRepository;
  let movieRepository;
  let resetOldLeaseService;

  beforeEach(async () => {
    leaseRepository = new LeaseMemoryRepository();
    movieRepository = new MovieMemoryRepository();

    resetOldLeaseService = new ResetOldLeaseService({
      leaseRepository,
      movieRepository,
    });
  });

  async function createMovieAndLease() {
    const movieCreated = await movieRepository.create({
      name: 'Fake name',
      synopsis: 'Fake synopsis',
      rating: 33,
    });

    const leaseCreated = await leaseRepository.create({
      movieId: movieCreated.id,
      status: 'WAITING',
    });

    await Promise.all([
      movieRepository.update(movieCreated.id, {
        isAvailable: false,
      }),
      leaseRepository.update(leaseCreated.id, {
        createdAt: new Date(new Date().getTime() - 3 * 60 * 60 * 1000 - 1),
      }),
    ]);
  }

  it('must cancel reservations and make films available', async () => {
    await Promise.all([
      createMovieAndLease(),
      createMovieAndLease(),
      createMovieAndLease(),
    ]);

    const beforeServiceMovies = await movieRepository.findAvailable();
    expect(beforeServiceMovies.length).toBe(0);

    const result = await resetOldLeaseService.execute();
    expect(result).toHaveProperty('leasesCount');

    const afterServiceMovies = await movieRepository.findAvailable();
    expect(afterServiceMovies.length).toBe(result.leasesCount);
  });
});
