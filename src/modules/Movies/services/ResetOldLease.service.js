import { LeaseMongooseRepository } from '../repositories/mongoose/LeaseMongooseRepository.js';
import { MovieMongooseRepository } from '../repositories/mongoose/MovieMongooseRepository.js';

export class ResetOldLeaseService {
  constructor({ movieRepository, leaseRepository } = {}) {
    this.movieRepository = movieRepository;
    this.leaseRepository = leaseRepository;

    if (!this.movieRepository) {
      this.movieRepository = new MovieMongooseRepository();
    }

    if (!this.leaseRepository) {
      this.leaseRepository = new LeaseMongooseRepository();
    }
  }

  async execute() {
    const leases = await this.leaseRepository.findOlderLeases();

    await Promise.all(
      leases.map(async (lease) => {
        await Promise.all([
          this.leaseRepository.update(lease.id, {
            status: 'CANCELLED',
          }),
          this.movieRepository.update(lease.movieId, {
            isAvailable: true,
          }),
        ]);
      }),
    );

    return {
      leasesCount: leases.length,
    };
  }
}
