import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { moviesData } from '../../../../../tests/moviesData.js';
import { app } from '../../../../infra/http/app.js';
import { MovieMongooseRepository } from '../../repositories/mongoose/MovieMongooseRepository.js';

describe('[e2e] /api/book', () => {
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

  it('[e2e] it must be possible to make a reservation', async () => {
    const movieListResponse = await supertest(app).get('/api/all');

    expect(movieListResponse.body.length).toBe(10);

    const reservationResponse = await supertest(app).post('/api/book').send({
      movieId: movieListResponse.body[0].id,
    });

    expect(reservationResponse.statusCode).toBe(201);
    expect(reservationResponse.body).toHaveProperty('reserveId');
    expect(reservationResponse.body).toHaveProperty('status');
    expect(reservationResponse.body.status).toBe('WAITING');

    const checkMovieListResponse = await supertest(app).get('/api/all');
    expect(checkMovieListResponse.body.length).toBe(9);
  });

  it('[e2e] It should not be possible to make a reservation for a film that is not available', async () => {
    const movieListResponse = await supertest(app).get('/api/all');

    expect(movieListResponse.body.length).toBe(10);

    await supertest(app).post('/api/book').send({
      movieId: movieListResponse.body[0].id,
    });

    const reservationResponse = await supertest(app).post('/api/book').send({
      movieId: movieListResponse.body[0].id,
    });

    expect(reservationResponse.statusCode).toBe(400);
    expect(reservationResponse.body).toHaveProperty('message');
    expect(reservationResponse.body).toHaveProperty('messageCode');
  });

  it('[e2e] It should not be possible to make a reservation for a film that does not exist', async () => {
    const reservationResponse = await supertest(app).post('/api/book').send({
      movieId: randomUUID(),
    });

    expect(reservationResponse.statusCode).toBe(404);
    expect(reservationResponse.body).toHaveProperty('message');
    expect(reservationResponse.body).toHaveProperty('messageCode');
  });
});
