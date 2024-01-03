import supertest from 'supertest';

import { app } from './app.js';

describe('[e2e] GET /', () => {
  it('[e2e] responds with json', async () => {
    const response = await supertest(app).get('/');

    expect(response.headers).toHaveProperty(
      'content-type',
      'application/json; charset=utf-8',
    );
    expect(response.statusCode).toBe(200);
  });
});
