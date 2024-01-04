import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { moviesData } from '../../../../../tests/moviesData.js';
import { app } from '../../../../infra/http/app.js';
import { MovieMongooseRepository } from '../../repositories/mongoose/MovieMongooseRepository.js';

describe('[e2e] /api/confirm', () => {
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

  it('[e2e] it must be possible to confirm a reservation', async () => {
    const movieListResponse = await supertest(app).get('/api/all');

    const reservationResponse = await supertest(app).post('/api/book').send({
      movieId: movieListResponse.body[0].id,
    });

    const confirmResponse = await supertest(app)
      .post('/api/confirm')
      .send({
        reserveId: reservationResponse.body.reserveId,
        customer: {
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '123456789',
        },
      });

    expect(confirmResponse.statusCode).toBe(200);
    expect(confirmResponse.body).toHaveProperty('scheduleId');
    expect(confirmResponse.body).toHaveProperty('status');
    expect(confirmResponse.body.status).toBe('LEASED');
  });
});
