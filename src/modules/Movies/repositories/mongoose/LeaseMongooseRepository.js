import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

import { LeaseSchema } from './schemas/LeaseSchema.js';

export class LeaseMongooseRepository {
  constructor() {
    this.LeaseModel = mongoose.model('leases', LeaseSchema);
  }

  async create(lease) {
    const newLease = new this.LeaseModel({
      ...lease,
      id: randomUUID(),
      createdAt: new Date(),
    });

    await newLease.save();

    return newLease;
  }

  async findById(id) {
    const lease = await this.LeaseModel.findOne({
      id,
    });

    return lease;
  }

  async update(id, lease) {
    const updatedLease = await this.LeaseModel.findOneAndUpdate(
      {
        id,
      },
      {
        ...lease,
        id,
      },
      {
        new: true,
      },
    );

    return updatedLease;
  }
}
