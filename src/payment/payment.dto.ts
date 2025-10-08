import {ArgsType, Field, Float, Int} from 'type-graphql';
import Payment from './payment.entity';

@ArgsType()
export class CreatePaymentInput implements Partial<Payment> {
  @Field(() => Int)
  tenantId!: number;

  @Field()
  paymentDate!: Date;

  @Field(() => Float)
  amount!: number;
}

@ArgsType()
export class UpdatePaymentInput extends CreatePaymentInput {
  @Field(() => Int)
  id!: number;
}
