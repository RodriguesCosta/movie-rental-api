import { randomUUID } from 'crypto';

import { AppError } from '../../../utils/AppError.js';
import { LeaseMemoryRepository } from '../repositories/memory/LeaseMemoryRepository.js';
import { ConfirmLeaseService } from './ConfirmLease.service.js';

describe('ConfirmLeaseService', () => {
  let leaseRepository;
  let confirmLeaseService;

  beforeEach(async () => {
    leaseRepository = new LeaseMemoryRepository();

    confirmLeaseService = new ConfirmLeaseService({
      leaseRepository,
    });
  });

  async function createLease() {
    const leaseCreated = await leaseRepository.create({
      movieId: randomUUID(),
      status: 'WAITING',
    });

    return leaseCreated;
  }

  it('it must be possible to confirm a reservation', async () => {
    const leaseCreated = await createLease();

    const leaseConfirmed = await confirmLeaseService.execute({
      reserveId: leaseCreated.id,
      customer: {
        name: 'John Doe',
        email: 'john@mail.com',
        phone: '123456789',
      },
    });

    expect(leaseConfirmed).toHaveProperty('lease');
    expect(leaseConfirmed.lease).toHaveProperty('status');
    expect(leaseConfirmed.lease.status).toBe('LEASED');
  });

  it('It must not be possible to confirm a reservation with the customer without data', async () => {
    await expect(
      confirmLeaseService.execute({
        reserveId: randomUUID(),
        customer: {},
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Invalid customer',
        messageCode: 'service.lease.invalidCustomer',
        statusCode: 400,
      }),
    );
  });

  it('It should not be possible to confirm a reservation that does not exist', async () => {
    await expect(
      confirmLeaseService.execute({
        reserveId: randomUUID(),
        customer: {
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '123456789',
        },
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Lease not found',
        messageCode: 'service.lease.leaseNotFound',
        statusCode: 404,
      }),
    );
  });

  it('It should not be possible to confirm a reservation that has already been confirmed', async () => {
    const leaseCreated = await createLease();

    await confirmLeaseService.execute({
      reserveId: leaseCreated.id,
      customer: {
        name: 'John Doe',
        email: 'john@mail.com',
        phone: '123456789',
      },
    });

    await expect(
      confirmLeaseService.execute({
        reserveId: leaseCreated.id,
        customer: {
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '123456789',
        },
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Lease not available',
        messageCode: 'service.lease.leaseNotAvailable',
        statusCode: 400,
      }),
    );
  });

  it('It should not be possible to confirm a reservation lasting more than 3 hours', async () => {
    const leaseCreated = await createLease();

    await leaseRepository.update(leaseCreated.id, {
      createdAt: new Date(new Date().getTime() - 3 * 60 * 60 * 1000 - 1),
    });

    await expect(
      confirmLeaseService.execute({
        reserveId: leaseCreated.id,
        customer: {
          name: 'John Doe',
          email: 'john@mail.com',
          phone: '123456789',
        },
      }),
    ).rejects.toEqual(
      new AppError({
        message: 'Lease expired',
        messageCode: 'service.lease.leaseExpired',
        statusCode: 400,
      }),
    );
  });
});
