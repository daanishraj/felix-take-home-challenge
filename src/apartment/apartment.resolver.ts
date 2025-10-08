import {Query, Arg, Int, Resolver, Mutation, Args} from 'type-graphql';

import {CreateApartmentInput, UpdateApartmentInput} from './apartment.dto';
import Apartment from './apartment.entity';
import APARTMENT_ERRORS from './apartment.errors';

@Resolver(() => Apartment)
export default class ApartmentResolver {
  @Query(() => [Apartment])
  async apartments(): Promise<Apartment[]> {
    return Apartment.find();
  }

  @Query(() => Apartment, {nullable: true})
  async apartment(@Arg('id', () => Int) id: number): Promise<Apartment | null> {
    return Apartment.findOne({where: {id}});
  }

  @Mutation(() => Apartment)
  async createApartment(@Args() data: CreateApartmentInput): Promise<Apartment> {
    return Apartment.getRepository()
      .create(data)
      .save();
  }

  @Mutation(() => Apartment, {nullable: true})
  async updateApartment(@Args() data: UpdateApartmentInput): Promise<Apartment> {
    const apartment = await Apartment.findOne({where: {id: data.id}});
    if (!apartment) {
      throw new Error(APARTMENT_ERRORS.INVALID_ID);
    }
    Object.assign(apartment, data);
    await apartment.save();

    return apartment;
  }

  @Mutation(() => Apartment, {nullable: true})
  async deleteApartment(@Arg('id', () => Int) id: number): Promise<Apartment> {
    const apartment = await Apartment.findOne({where: {id}});
    if (!apartment) {
      throw new Error(APARTMENT_ERRORS.INVALID_ID);
    }
    await Apartment.delete(id);

    return apartment;
  }
}
