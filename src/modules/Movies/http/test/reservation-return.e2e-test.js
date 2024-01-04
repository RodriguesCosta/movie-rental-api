import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { moviesData } from '../../../../../tests/moviesData.js';
import { app } from '../../../../infra/http/app.js';
import { MovieMongooseRepository } from '../../repositories/mongoose/MovieMongooseRepository.js';

describe('[e2e] /api/return', () => {
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

    await supertest(app)
      .post('/api/confirm')
      .send({
        reserveId: reservationResponse.body.reserveId,
        customer: {
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '123456789',
        },
      });

    const returnResponse = await supertest(app).post('/api/return').send({
      scheduleId: reservationResponse.body.reserveId,
    });

    expect(returnResponse.statusCode).toBe(200);
    expect(returnResponse.body).toHaveProperty('scheduleId');
    expect(returnResponse.body).toHaveProperty('status');
    expect(returnResponse.body.status).toBe('RETURNED');
  });
});
