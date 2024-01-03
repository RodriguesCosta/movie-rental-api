import 'dotenv/config';

import mongoose from 'mongoose';

import { app } from './app.js';

await mongoose.connect(process.env.MONGO_URL);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
