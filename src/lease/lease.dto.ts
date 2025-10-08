import {ArgsType, Field, Float, Int} from 'type-graphql';
import Lease from './lease.entity';

@ArgsType()
export class CreateLeaseInput implements Partial<Lease> {
  @Field(() => Int)
  tenantId!: number;

  @Field(() => Int)
  apartmentId!: number;

  @Field()
  start!: Date;

  @Field({nullable: true})
  end?: Date | null;

  @Field(() => Float)
  rent!: number;

  @Field(() => Float)
  deposit!: number;
}

@ArgsType()
export class UpdateLeaseInput extends CreateLeaseInput {
  @Field(() => Int)
  id!: number;
}
