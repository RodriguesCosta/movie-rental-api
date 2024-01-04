import { AppError } from '../../../utils/AppError.js';
import { LeaseMongooseRepository } from '../repositories/mongoose/LeaseMongooseRepository.js';
import { MovieMongooseRepository } from '../repositories/mongoose/MovieMongooseRepository.js';

export class CreateLeaseService {
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

  async execute({ movieId }) {
    const movie = await this.movieRepository.findById(movieId);

    if (!movie) {
      throw new AppError({
        message: 'Movie not found',
        messageCode: 'service.movie.movieNotFound',
        statusCode: 404,
      });
    }

    if (!movie.isAvailable) {
      throw new AppError({
        message: 'Movie not available',
        messageCode: 'service.movie.movieNotAvailable',
        statusCode: 400,
      });
    }

    const lease = await this.leaseRepository.create({
      movieId,
      status: 'WAITING',
    });

    await this.movieRepository.update(movieId, {
      isAvailable: false,
    });

    return {
      lease,
    };
  }
}
