import {createPayment, createTenant} from '../../factories';
import {CreatePaymentInput} from '../payment.dto';
import Payment from '../payment.entity';
import LEASE_ERRORS from '../payment.errors';
import PaymentResolver from '../payment.resolver';

const Resolver = new PaymentResolver();

describe('PaymentResolver', () => {
  it('payments should return all payments', async () => {
    const payment = await createPayment();

    await expect(Resolver.payments()).resolves.toMatchObject([payment]);
  });

  it('payment should return one payment', async () => {
    const payment = await createPayment();

    await expect(Resolver.payment(payment.id)).resolves.toMatchObject(payment);
  });

  it('createPayment should return the created payment', async () => {
    const tenant = await createTenant();
    const payment: CreatePaymentInput = {
      tenantId: tenant.id,
      paymentDate: new Date(),
      amount: 3000,
    };

    const data = await Resolver.createPayment(payment);
    expect(data.id).toBeDefined();
    expect(data.tenantId).toBe(payment.tenantId);
    expect(data.paymentDate).toBe(payment.paymentDate);
    expect(data.amount).toBe(payment.amount);

    await expect(Payment.findOne({where: {id: data.id}})).resolves.toMatchObject(data);
  });

  it('updatePayment should return the update payment', async () => {
    const payment = await createPayment({amount: 3000});

    const data = await Resolver.updatePayment({...payment, amount: 3500});
    expect(data.id).toBe(payment.id);
    expect(data.amount).toBe(3500);

    await expect(Payment.findOne({where: {id: payment.id}})).resolves.toMatchObject(data);
  });

  it('updatePayment should only update existing payment', async () => {
    await expect(Resolver.updatePayment({id: 999} as Payment)).rejects.toThrow(LEASE_ERRORS.INVALID_ID);
  });

  it('delete should delete and return the payment', async () => {
    const payment = await createPayment();

    await expect(Resolver.deletePayment(payment.id)).resolves.toMatchObject(payment);

    await expect(Payment.findOne({where: {id: payment.id}})).resolves.toBeNull();
  });

  it('deletePayment should only delete existing payment', async () => {
    await expect(Resolver.deletePayment(999)).rejects.toThrow(LEASE_ERRORS.INVALID_ID);
  });

  it('should resolve tenant', async () => {
    const payment = await createPayment();
    const spy = jest.spyOn(payment, 'getTenant');
    await Resolver.tenant(payment);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
