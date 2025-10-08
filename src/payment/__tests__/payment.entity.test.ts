import {createPayment, createTenant} from '../../factories';
import Tenant from '../../tenant/tenant.entity';

describe('Payment', () => {
  it('tenant should be required', async () => {
    expect.assertions(2);
    try {
      await createPayment({tenantId: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('payment.tenantId');
    }
  });

  it('amount should be required', async () => {
    expect.assertions(2);
    try {
      await createPayment({amount: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('payment.amount');
    }
  });

  it('paymentDate should be required', async () => {
    expect.assertions(2);
    try {
      await createPayment({paymentDate: null});
    } catch (error) {
      expect(error.message).toMatch('NOT NULL');
      expect(error.message).toMatch('payment.paymentDate');
    }
  });

  it('should return id and timestamps on create', async () => {
    const tenant = await createPayment();
    expect(tenant).toHaveProperty('id');
    expect(tenant).toHaveProperty('createdAt');
    expect(tenant).toHaveProperty('updatedAt');
  });

  describe('getTenant', () => {
    it('should return tenant linked to this entity and memoized it', async () => {
      const spy = jest.spyOn(Tenant, 'findOneOrFail');
      const tenant = await createTenant();
      const payment = await createPayment({tenantId: tenant.id});
      const res = await payment.getTenant();
      expect(res).toMatchObject(tenant);
      await payment.getTenant();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
