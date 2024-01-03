import { MovieMongooseRepository } from '../repositories/mongoose/MovieMongooseRepository.js';

export class CreateMovieService {
  constructor(movieRepository) {
    this.movieRepository = movieRepository;

    if (!this.movieRepository) {
      this.movieRepository = new MovieMongooseRepository();
    }
  }

  async execute(movieData) {
    const movie = await this.movieRepository.create(movieData);

    return {
      movie,
    };
  }
}
