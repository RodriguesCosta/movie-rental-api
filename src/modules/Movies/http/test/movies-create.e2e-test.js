import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import supertest from 'supertest';

import { moviesData } from '../../../../../tests/moviesData.js';
import { app } from '../../../../infra/http/app.js';

describe('[e2e] /api/movie', () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: randomUUID(),
    });
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('[e2e] create movie', async () => {
    const response = await supertest(app)
      .post('/api/movie')
      .send({
        ...moviesData[0],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('movie');
    expect(response.body.movie).toHaveProperty('id');
    expect(response.body.movie.name).toBe(moviesData[0].name);
  });
});
