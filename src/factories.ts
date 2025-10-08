import {startOfMonth} from 'date-fns';
import {DeepPartial, BaseEntity} from 'typeorm';
import Apartment from './apartment/apartment.entity';
import Lease from './lease/lease.entity';
import Payment from './payment/payment.entity';
import Tenant from './tenant/tenant.entity';

/**
 * This file list useful functions to quickly create entities for testing purpose
 */

export type NullablePartial<T extends DeepPartial<BaseEntity>> = DeepPartial<Omit<{[K in keyof T]: T[K] | null | undefined}, 'id'>>;

const getRandom = (): string => {
  return `${Math.round(1000 * Math.random())}-${Date.now()}`;
};

export const createApartment = async (props?: NullablePartial<Apartment>): Promise<Apartment> => {
  const defaultProps: NullablePartial<Apartment> = {name: `Apartment-${getRandom()}`, address: `Address-${getRandom()}`, ...props};

  return (
    Apartment.getRepository()
      // @ts-ignore
      .create(defaultProps)
      .save()
  );
};

export const createTenant = async (props?: NullablePartial<Tenant>): Promise<Tenant> => {
  const defaultProps: NullablePartial<Tenant> = {name: 'John Doe', email: `john-${getRandom()}@onfelix.com`, ...props};

  return (
    Tenant.getRepository()
      // @ts-ignore
      .create(defaultProps)
      .save()
  );
};

export const createLease = async (props?: NullablePartial<Lease>): Promise<Lease> => {
  const defaultProps: NullablePartial<Lease> = {rent: 2000, deposit: 1000, start: startOfMonth(new Date()), ...props};

  if (typeof defaultProps.tenantId === 'undefined') {
    const tenant = await createTenant();
    defaultProps.tenantId = tenant.id;
  }

  if (typeof defaultProps.apartmentId === 'undefined') {
    const apartment = await createApartment();
    defaultProps.apartmentId = apartment.id;
  }

  return (
    Lease.getRepository()
      // @ts-ignore
      .create(defaultProps)
      .save()
  );
};

export const createPayment = async (props?: NullablePartial<Payment>): Promise<Payment> => {
  const defaultProps: NullablePartial<Payment> = {amount: 2000, paymentDate: new Date(), ...props};

  if (typeof defaultProps.tenantId === 'undefined') {
    const tenant = await createTenant();
    defaultProps.tenantId = tenant.id;
  }

  return (
    Payment.getRepository()
      // @ts-ignore
      .create(defaultProps)
      .save()
  );
};
