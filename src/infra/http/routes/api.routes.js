import { Router } from 'express';

import { moviesRouter } from '../../../modules/Movies/http/routes/movies.routes.js';

export const apiRouter = Router();

apiRouter.use('/', moviesRouter);
