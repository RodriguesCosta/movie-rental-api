import { randomUUID } from 'crypto';

import { AppError } from '../../../../utils/AppError.js';
import { Lease } from '../../entities/Lease.js';

export class LeaseMemoryRepository {
  constructor() {
    this.data = [];
  }

  async create(lease) {
    const newLease = await Lease.safeParseAsync({
      ...lease,
      id: randomUUID(),
      createdAt: new Date(),
    });

    if (!newLease.success) {
      throw new AppError({
        message: 'Invalid lease data',
        messageCode: 'database.lease.invalidData',
        statusCode: 400,
      });
    }

    this.data.push(newLease.data);

    return newLease.data;
  }

  async findById(id) {
    const lease = this.data.find((lease) => lease.id === id);

    return lease;
  }

  async update(id, lease) {
    const leaseIndex = this.data.findIndex((lease) => lease.id === id);

    if (leaseIndex === -1) {
      throw new AppError({
        message: 'Lease not found',
        messageCode: 'database.lease.notFound',
        statusCode: 404,
      });
    }

    const newLease = await Lease.safeParseAsync({
      ...this.data[leaseIndex],
      ...lease,
      id,
    });

    if (!newLease.success) {
      throw new AppError({
        message: 'Invalid lease data',
        messageCode: 'database.lease.invalidData',
        statusCode: 400,
      });
    }

    this.data[leaseIndex] = newLease.data;

    return newLease.data;
  }
}
