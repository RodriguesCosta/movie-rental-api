import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { moviesData } from '../../../../../tests/moviesData.js';
import { app } from '../../../../infra/http/app.js';
import { MovieMongooseRepository } from '../../repositories/mongoose/MovieMongooseRepository.js';

describe('[e2e] /api/all', () => {
  beforeEach(async () => {
    const movieRepository = new MovieMongooseRepository();

    await mongoose.connect(process.env.MONGO_URL, {
      dbName: randomUUID(),
    });

    for (const movie of moviesData) {
      await movieRepository.create(movie);
    }
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('[e2e] get all movies', async () => {
    const response = await supertest(app).get('/api/all');

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(10);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('synopsis');
    expect(response.body[0]).toHaveProperty('rating');
  });
});
