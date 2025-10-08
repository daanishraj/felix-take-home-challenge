import {Query, Arg, Int, Resolver, Mutation, Args, FieldResolver, Root} from 'type-graphql';
import Tenant from '../tenant/tenant.entity';
import {CreatePaymentInput, UpdatePaymentInput} from './payment.dto';
import Payment from './payment.entity';
import LEASE_ERRORS from './payment.errors';

@Resolver(() => Payment)
export default class PaymentResolver {
  @Query(() => [Payment])
  async payments(): Promise<Payment[]> {
    return Payment.find();
  }

  @Query(() => Payment, {nullable: true})
  async payment(@Arg('id', () => Int) id: number): Promise<Payment | null> {
    return Payment.findOne({where: {id}});
  }

  @Mutation(() => Payment)
  async createPayment(@Args() data: CreatePaymentInput): Promise<Payment> {
    return Payment.getRepository()
      .create(data)
      .save();
  }

  @Mutation(() => Payment, {nullable: true})
  async updatePayment(@Args() data: UpdatePaymentInput): Promise<Payment> {
    const payment = await Payment.findOne({where: {id: data.id}});
    if (!payment) {
      throw new Error(LEASE_ERRORS.INVALID_ID);
    }
    Object.assign(payment, data);
    await payment.save();

    return payment;
  }

  @Mutation(() => Payment, {nullable: true})
  async deletePayment(@Arg('id', () => Int) id: number): Promise<Payment> {
    const payment = await Payment.findOne({where: {id}});
    if (!payment) {
      throw new Error(LEASE_ERRORS.INVALID_ID);
    }
    await Payment.delete(id);

    return payment;
  }

  @FieldResolver(() => Tenant)
  async tenant(@Root() payment: Payment): Promise<Tenant> {
    return payment.getTenant();
  }
}
