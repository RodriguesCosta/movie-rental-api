import 'dotenv/config';

import mongoose from 'mongoose';
import nodeCron from 'node-cron';

import { populateApi } from '../../../scripts/populateApi.js';
import { ResetOldLeaseService } from '../../modules/Movies/services/ResetOldLease.service.js';
import { app } from './app.js';

await mongoose.connect(process.env.MONGO_URL);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');

  try {
    populateApi();
  } catch {
    // nothing to do
  }
});

const resetOldLeaseService = new ResetOldLeaseService();

nodeCron.schedule('* * * * *', async () => {
  try {
    const result = await resetOldLeaseService.execute();
    console.log(`${result.leasesCount} leases reseted`);
  } catch {
    // nothing to do
  }
});
