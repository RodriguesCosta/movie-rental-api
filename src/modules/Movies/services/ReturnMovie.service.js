import { AppError } from '../../../utils/AppError.js';
import { LeaseMongooseRepository } from '../repositories/mongoose/LeaseMongooseRepository.js';
import { MovieMongooseRepository } from '../repositories/mongoose/MovieMongooseRepository.js';

export class ReturnMovieService {
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

  async execute({ scheduleId }) {
    const lease = await this.leaseRepository.findById(scheduleId);

    if (!lease) {
      throw new AppError({
        message: 'Lease not found',
        messageCode: 'service.lease.leaseNotFound',
        statusCode: 404,
      });
    }

    if (lease.status !== 'LEASED') {
      throw new AppError({
        message: 'Lease not confirmed',
        messageCode: 'service.lease.leaseNotConfirmed',
        statusCode: 400,
      });
    }

    const leaseUpdated = await this.leaseRepository.update(scheduleId, {
      status: 'RETURNED',
    });

    await this.movieRepository.update(lease.movieId, {
      isAvailable: true,
    });

    return {
      lease: leaseUpdated,
    };
  }
}
