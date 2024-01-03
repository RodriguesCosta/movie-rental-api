import express from 'express';
import ms from 'ms';

import { AppError } from '../../utils/AppError.js';

export const app = express();

app.use(express.json());

const startDate = new Date();

app.get('/', (req, res) => {
  res.json({
    uptime: ms(new Date().getTime() - startDate.getTime()),
  });
});

app.use((err, request, response, _) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      messageCode: err.messageCode,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
    messageCode: 'internal.server.error',
  });
});
