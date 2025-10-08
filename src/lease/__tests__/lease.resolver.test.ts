import {startOfDay, startOfMonth} from 'date-fns';
import {createApartment, createLease, createTenant} from '../../factories';
import {CreateLeaseInput} from '../lease.dto';
import Lease from '../lease.entity';
import LEASE_ERRORS from '../lease.errors';
import LeaseResolver from '../lease.resolver';

const Resolver = new LeaseResolver();

describe('LeaseResolver', () => {
  it('leases should return all leases', async () => {
    const lease = await createLease();

    await expect(Resolver.leases()).resolves.toMatchObject([lease]);
  });

  it('lease should return one lease', async () => {
    const lease = await createLease();

    await expect(Resolver.lease(lease.id)).resolves.toMatchObject(lease);
  });

  it('createLease should return the created lease', async () => {
    const tenant = await createTenant();
    const apartment = await createApartment();
    const lease: CreateLeaseInput = {
      tenantId: tenant.id,
      apartmentId: apartment.id,
      start: startOfMonth(new Date()),
      end: null,
      rent: 3000,
      deposit: 6000,
    };

    const data = await Resolver.createLease(lease);
    expect(data.id).toBeDefined();
    expect(data.tenantId).toBe(lease.tenantId);
    expect(data.apartmentId).toBe(lease.apartmentId);
    expect(data.start).toStrictEqual(startOfDay(lease.start));
    expect(data.end).toBe(lease.end);
    expect(data.rent).toBe(lease.rent);
    expect(data.deposit).toBe(lease.deposit);

    await expect(Lease.findOne({where: {id: data.id}})).resolves.toMatchObject(data);
  });

  it('updateLease should return the update lease', async () => {
    const lease = await createLease({rent: 3000});

    const data = await Resolver.updateLease({...lease, rent: 3500});
    expect(data.id).toBe(lease.id);
    expect(data.rent).toBe(3500);

    await expect(Lease.findOne({where: {id: lease.id}})).resolves.toMatchObject(data);
  });

  it('updateLease should only update existing lease', async () => {
    await expect(Resolver.updateLease({id: 999} as Lease)).rejects.toThrow(LEASE_ERRORS.INVALID_ID);
  });

  it('delete should delete and return the lease', async () => {
    const lease = await createLease();

    await expect(Resolver.deleteLease(lease.id)).resolves.toMatchObject(lease);

    await expect(Lease.findOne({where: {id: lease.id}})).resolves.toBeNull();
  });

  it('deleteLease should only delete existing lease', async () => {
    await expect(Resolver.deleteLease(999)).rejects.toThrow(LEASE_ERRORS.INVALID_ID);
  });

  it('should resolve tenant', async () => {
    const lease = await createLease();
    const spy = jest.spyOn(lease, 'getTenant');
    await Resolver.tenant(lease);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should resolve apartment', async () => {
    const lease = await createLease();
    const spy = jest.spyOn(lease, 'getApartment');
    await Resolver.apartment(lease);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
