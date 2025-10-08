import {Query, Arg, Int, Resolver, Mutation, Args, FieldResolver, Root} from 'type-graphql';

import Apartment from '../apartment/apartment.entity';
import Tenant from '../tenant/tenant.entity';
import {CreateLeaseInput, UpdateLeaseInput} from './lease.dto';
import Lease from './lease.entity';
import LEASE_ERRORS from './lease.errors';

@Resolver(() => Lease)
export default class LeaseResolver {
  @Query(() => [Lease])
  async leases(): Promise<Lease[]> {
    return Lease.find();
  }

  @Query(() => Lease, {nullable: true})
  async lease(@Arg('id', () => Int) id: number): Promise<Lease | null> {
    return Lease.findOne({where: {id}});
  }

  @Mutation(() => Lease)
  async createLease(@Args() data: CreateLeaseInput): Promise<Lease> {
    return Lease.getRepository()
      .create(data)
      .save();
  }

  @Mutation(() => Lease, {nullable: true})
  async updateLease(@Args() data: UpdateLeaseInput): Promise<Lease> {
    const lease = await Lease.findOne({where: {id: data.id}});
    if (!lease) {
      throw new Error(LEASE_ERRORS.INVALID_ID);
    }
    Object.assign(lease, data);
    await lease.save();

    return lease;
  }

  @Mutation(() => Lease, {nullable: true})
  async deleteLease(@Arg('id', () => Int) id: number): Promise<Lease> {
    const lease = await Lease.findOne({where: {id}});
    if (!lease) {
      throw new Error(LEASE_ERRORS.INVALID_ID);
    }
    await Lease.delete(id);

    return lease;
  }

  @FieldResolver(() => Tenant)
  async tenant(@Root() lease: Lease): Promise<Tenant> {
    return lease.getTenant();
  }

  @FieldResolver(() => Apartment)
  async apartment(@Root() lease: Lease): Promise<Apartment> {
    return lease.getApartment();
  }
}
