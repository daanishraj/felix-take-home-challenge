import {ArgsType, Field, Int} from 'type-graphql';
import Apartment from './apartment.entity';

@ArgsType()
export class CreateApartmentInput implements Partial<Apartment> {
  @Field()
  name!: string;

  @Field()
  address!: string;
}

@ArgsType()
export class UpdateApartmentInput extends CreateApartmentInput {
  @Field(() => Int)
  id!: number;
}
