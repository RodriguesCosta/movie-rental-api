import { AppError } from '../../../utils/AppError.js';
import { LeaseCustomer } from '../entities/Lease.js';
import { LeaseMongooseRepository } from '../repositories/mongoose/LeaseMongooseRepository.js';

export class ConfirmLeaseService {
  constructor({ leaseRepository } = {}) {
    this.leaseRepository = leaseRepository;

    if (!this.leaseRepository) {
      this.leaseRepository = new LeaseMongooseRepository();
    }
  }

  async execute({ reserveId, customer }) {
    const customerValidation = await LeaseCustomer.safeParseAsync(customer);

    if (!customerValidation.success) {
      throw new AppError({
        message: 'Invalid customer',
        messageCode: 'service.lease.invalidCustomer',
        statusCode: 400,
      });
    }

    const lease = await this.leaseRepository.findById(reserveId);

    if (!lease) {
      throw new AppError({
        message: 'Lease not found',
        messageCode: 'service.lease.leaseNotFound',
        statusCode: 404,
      });
    }

    if (lease.status !== 'WAITING') {
      throw new AppError({
        message: 'Lease not available',
        messageCode: 'service.lease.leaseNotAvailable',
        statusCode: 400,
      });
    }

    if (
      new Date(lease.createdAt).getTime() <
      new Date().getTime() - 3 * 60 * 60 * 1000
    ) {
      throw new AppError({
        message: 'Lease expired',
        messageCode: 'service.lease.leaseExpired',
        statusCode: 400,
      });
    }

    const leaseUpdated = await this.leaseRepository.update(reserveId, {
      status: 'LEASED',
      customer: customerValidation.data,
    });

    return {
      lease: leaseUpdated,
    };
  }
}
