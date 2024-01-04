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
    })
      .lean()
      .exec();

    return lease;
  }

  async findOlderLeases(hours = 3) {
    const date = new Date().getTime() - hours * 60 * 60 * 1000;

    const leases = await this.LeaseModel.find({
      createdAt: {
        $lt: new Date(date),
      },
    })
      .lean()
      .exec();

    return leases;
  }

  async update(id, lease) {
    const updatedLease = await this.LeaseModel.findOneAndUpdate(
      {
        id,
      },
      {
        $set: {
          ...lease,
          id,
        },
      },
      {
        new: true,
      },
    )
      .lean()
      .exec();

    return updatedLease;
  }
}
