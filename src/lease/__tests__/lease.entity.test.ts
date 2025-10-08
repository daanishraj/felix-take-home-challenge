import {addDays, addMonths, endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, subDays, subMonths} from 'date-fns';
import Apartment from '../../apartment/apartment.entity';
import {createApartment, createLease, createTenant} from '../../factories';
import Tenant from '../../tenant/tenant.entity';
import LEASE_ERRORS from '../lease.errors';

describe('Lease', () => {
  it('tenant should be required', async () => {
    expect.assertions(2);
    try {
      await createLease({tenantId: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('lease.tenantId');
    }
  });

  it('apartment should be required', async () => {
    expect.assertions(2);
    try {
      await createLease({apartmentId: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('lease.apartmentId');
    }
  });

  it('rent should be required', async () => {
    expect.assertions(2);
    try {
      await createLease({rent: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('lease.rent');
    }
  });

  it('deposit should be required', async () => {
    expect.assertions(2);
    try {
      await createLease({deposit: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('lease.deposit');
    }
  });

  it('start should be required', async () => {
    expect.assertions(2);
    try {
      await createLease({start: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('lease.start');
    }
  });

  it('start must be at the beginning of a month', async () => {
    const start = startOfMonth(new Date());
    await expect(createLease({start: addDays(start, 1)})).rejects.toThrow(LEASE_ERRORS.START_NOT_BEGINNING_OF_MONTH);
  });

  it('end must be at the end of a month', async () => {
    const start = startOfMonth(new Date());
    await expect(createLease({start, end: addDays(endOfMonth(start), -1)})).rejects.toThrow(LEASE_ERRORS.END_NOT_END_OF_MONTH);
  });

  it('start to be enforced to start of day', async () => {
    const start = startOfMonth(new Date());
    const lease = await createLease({start: endOfDay(start)});
    expect(lease.start).toStrictEqual(start);
  });

  it('end to be enforced to end of day', async () => {
    const start = startOfMonth(new Date());
    const lease = await createLease({start, end: startOfDay(endOfMonth(start))});
    expect(lease.end).toStrictEqual(endOfDay(endOfMonth(start)));
  });

  it('end must be after start', async () => {
    const start = startOfMonth(new Date());
    await expect(createLease({start, end: subDays(start, 1)})).rejects.toThrow(LEASE_ERRORS.END_BEFORE_START);
  });

  it('should return id and timestamps on create', async () => {
    const tenant = await createLease();
    expect(tenant).toHaveProperty('id');
    expect(tenant).toHaveProperty('createdAt');
    expect(tenant).toHaveProperty('updatedAt');
  });

  describe('validateTenantNoOverlappingLeases', () => {
    it('should reject when new lease starts inside an existing lease', async () => {
      const tenant = await createTenant();
      const start = new Date('2020-01-01');
      const end = endOfMonth(addMonths(start, 2));
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: addMonths(start, 1), end: endOfYear(start)})).rejects.toThrow(
        LEASE_ERRORS.USER_OVERLAP
      );
    });

    it('should reject when new lease ends inside an existing lease', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 2));
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: subMonths(start, 4), end: endOfMonth(addMonths(start, 1))})).rejects.toThrow(
        LEASE_ERRORS.USER_OVERLAP
      );
    });

    it('should reject when new lease fully covers an existing lease', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 2));
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: subMonths(start, 4), end: addMonths(end, 5)})).rejects.toThrow(
        LEASE_ERRORS.USER_OVERLAP
      );
    });

    it('should reject when new lease is fully covered by an existing lease', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 5));
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: addMonths(start, 1), end: endOfMonth(addMonths(start, 1))})).rejects.toThrow(
        LEASE_ERRORS.USER_OVERLAP
      );
    });

    it('should reject when both leases are open-ended', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      await createLease({tenantId: tenant.id, start, end: null});

      await expect(createLease({tenantId: tenant.id, start: addMonths(start, 1), end: null})).rejects.toThrow(LEASE_ERRORS.USER_OVERLAP);
    });

    it('should reject when new open-ended lease starts before an existing closed lease ends', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: subMonths(start, 4), end: null})).rejects.toThrow(LEASE_ERRORS.USER_OVERLAP);
    });

    it('should reject when existing open-ended lease overlaps with a new closed lease', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      await createLease({tenantId: tenant.id, start, end: null});

      await expect(createLease({tenantId: tenant.id, start: addMonths(start, 10), end: endOfMonth(addMonths(start, 10))})).rejects.toThrow(
        LEASE_ERRORS.USER_OVERLAP
      );
    });

    it('should allow when new lease starts exactly at end of existing lease (no overlap)', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);
      await createLease({tenantId: tenant.id, start, end});

      await expect(createLease({tenantId: tenant.id, start: addDays(end, 1), end: null})).resolves.not.toThrow();
    });

    it('should be possible to create an ended lease before an existing open-ended lease', async () => {
      const tenant = await createTenant();
      const start = startOfMonth(new Date());
      await createLease({tenantId: tenant.id, start, end: null});

      await expect(
        createLease({tenantId: tenant.id, start: subMonths(start, 4), end: endOfMonth(subMonths(start, 1))})
      ).resolves.not.toThrow();
    });
  });

  describe('validateApartmentNoOverlappingLeases', () => {
    it('should reject when new lease starts inside an existing lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 2));
      await createLease({apartmentId: apartment.id, start, end});

      await expect(
        createLease({apartmentId: apartment.id, start: addMonths(start, 1), end: endOfMonth(addMonths(end, 3))})
      ).rejects.toThrow(LEASE_ERRORS.APARTMENT_OVERLAP);
    });

    it('should reject when new lease ends inside an existing lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 2));
      await createLease({apartmentId: apartment.id, start, end});

      await expect(
        createLease({apartmentId: apartment.id, start: subMonths(start, 4), end: endOfMonth(subMonths(end, 1))})
      ).rejects.toThrow(LEASE_ERRORS.APARTMENT_OVERLAP);
    });

    it('should reject when new lease fully covers an existing lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);
      await createLease({apartmentId: apartment.id, start, end});

      await expect(
        createLease({apartmentId: apartment.id, start: subMonths(start, 4), end: endOfMonth(addMonths(end, 3))})
      ).rejects.toThrow(LEASE_ERRORS.APARTMENT_OVERLAP);
    });

    it('should reject when new lease is fully covered by an existing lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 5));
      await createLease({apartmentId: apartment.id, start, end});

      await expect(
        createLease({apartmentId: apartment.id, start: addMonths(start, 1), end: endOfMonth(subMonths(end, 1))})
      ).rejects.toThrow(LEASE_ERRORS.APARTMENT_OVERLAP);
    });

    it('should reject when both leases are open-ended', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      await createLease({apartmentId: apartment.id, start, end: null});

      await expect(createLease({apartmentId: apartment.id, start: addMonths(start, 10), end: null})).rejects.toThrow(
        LEASE_ERRORS.APARTMENT_OVERLAP
      );
    });

    it('should reject when new open-ended lease starts before an existing closed lease ends', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(addMonths(start, 2));
      await createLease({apartmentId: apartment.id, start, end});

      await expect(createLease({apartmentId: apartment.id, start: subMonths(start, 1), end: null})).rejects.toThrow(
        LEASE_ERRORS.APARTMENT_OVERLAP
      );
    });

    it('should reject when existing open-ended lease overlaps with a new closed lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      await createLease({apartmentId: apartment.id, start, end: null});

      await expect(
        createLease({apartmentId: apartment.id, start: addMonths(start, 2), end: endOfMonth(addMonths(start, 2))})
      ).rejects.toThrow(LEASE_ERRORS.APARTMENT_OVERLAP);
    });

    it('should allow when new lease starts exactly at end of existing lease (no overlap)', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      const end = endOfMonth(start);
      await createLease({apartmentId: apartment.id, start, end});

      await expect(createLease({apartmentId: apartment.id, start: addDays(end, 1), end: null})).resolves.not.toThrow();
    });

      it('should be possible to create an ended lease before an existing open-ended lease', async () => {
      const apartment = await createApartment();
      const start = startOfMonth(new Date());
      await createLease({apartmentId: apartment.id, start, end: null});

      await expect(
        createLease({apartmentId: apartment.id, start: subMonths(start, 4), end: endOfMonth(subMonths(start, 1))})
      ).resolves.not.toThrow();
    });
  });

  describe('getTenant', () => {
    it('should return tenant linked to this entity and memoized it', async () => {
      const spy = jest.spyOn(Tenant, 'findOneOrFail');
      const tenant = await createTenant();
      const lease = await createLease({tenantId: tenant.id});
      const res = await lease.getTenant();
      expect(res).toMatchObject(tenant);
      await lease.getTenant();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getApartment', () => {
    it('should return apartment linked to this entity and memoized it', async () => {
      const spy = jest.spyOn(Apartment, 'findOneOrFail');
      const apartment = await createApartment();
      const lease = await createLease({apartmentId: apartment.id});
      const res = await lease.getApartment();
      expect(res).toMatchObject(apartment);
      await lease.getApartment();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
