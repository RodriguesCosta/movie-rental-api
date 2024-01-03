import supertest from 'supertest';

import { app } from './app.js';

describe('GET /', function () {
  it('responds with json', (done) => {
    supertest(app).get('/').expect('Content-Type', /json/).expect(200, done);
  });
});
