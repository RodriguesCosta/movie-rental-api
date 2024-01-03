import { MovieMongooseRepository } from '../repositories/mongoose/MovieMongooseRepository.js';

export class GelAllMoviesService {
  constructor(movieRepository) {
    this.movieRepository = movieRepository;

    if (!this.movieRepository) {
      this.movieRepository = new MovieMongooseRepository();
    }
  }

  async execute() {
    const movies = await this.movieRepository.findAvailable();

    return {
      movies,
    };
  }
}
