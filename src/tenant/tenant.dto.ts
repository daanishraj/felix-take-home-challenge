import {ArgsType, Field, Int} from 'type-graphql';
import Tenant from './tenant.entity';

@ArgsType()
export class CreateTenantInput implements Partial<Tenant> {
  @Field()
  name!: string;

  @Field()
  email!: string;
}

@ArgsType()
export class UpdateTenantInput extends CreateTenantInput {
  @Field(() => Int)
  id!: number;
}
