import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

import { MovieSchema } from './schemas/MovieSchema.js';

export class MovieMongooseRepository {
  constructor() {
    this.MovieModel = mongoose.model('movies', MovieSchema);
  }

  async create(movie) {
    const newMovie = new this.MovieModel({
      ...movie,
      id: randomUUID(),
    });

    await newMovie.save();

    return newMovie;
  }

  async findAvailable() {
    const result = await this.MovieModel.find({
      isAvailable: true,
    });

    return result;
  }

  async findById(id) {
    const movie = await this.MovieModel.findOne({
      id,
    });

    return movie;
  }

  async update(id, movie) {
    const updatedMovie = await this.MovieModel.findOneAndUpdate(
      {
        id,
      },
      {
        ...movie,
        id,
      },
      {
        new: true,
      },
    );

    return updatedMovie;
  }
}
