import {Query, Arg, Int, Resolver, Mutation, Args, FieldResolver, Root} from 'type-graphql';

import Lease from '../lease/lease.entity';
import {CreateTenantInput, UpdateTenantInput} from './tenant.dto';
import Tenant from './tenant.entity';
import TENANT_ERRORS from './tenant.errors';
import Payment from '../payment/payment.entity';
import {startOfMonth, endOfMonth, startOfDay, isAfter} from 'date-fns';
import {Between, LessThanOrEqual, MoreThanOrEqual, IsNull} from 'typeorm';

@Resolver(() => Tenant)
export default class TenantResolver {
  @Query(() => [Tenant])
  async tenants(): Promise<Tenant[]> {
    return Tenant.find();
  }

  @Query(() => Tenant, {nullable: true})
  async tenant(@Arg('id', () => Int) id: number): Promise<Tenant | null> {
    return Tenant.findOne({where: {id}});
  }

  @Mutation(() => Tenant)
  async createTenant(@Args() data: CreateTenantInput): Promise<Tenant> {
    return Tenant.getRepository()
      .create(data)
      .save();
  }

  @Mutation(() => Tenant, {nullable: true})
  async updateTenant(@Args() data: UpdateTenantInput): Promise<Tenant> {
    const tenant = await Tenant.findOne({where: {id: data.id}});
    if (!tenant) {
      throw new Error(TENANT_ERRORS.INVALID_ID);
    }
    Object.assign(tenant, data);
    await tenant.save();

    return tenant;
  }

  @Mutation(() => Tenant, {nullable: true})
  async deleteTenant(@Arg('id', () => Int) id: number): Promise<Tenant> {
    const tenant = await Tenant.findOne({where: {id}});
    if (!tenant) {
      throw new Error(TENANT_ERRORS.INVALID_ID);
    }
    await Tenant.delete(id);

    return tenant;
  }

  @Mutation(() => Boolean)
  async markRentAsLate(@Arg('id', () => Int) id: number): Promise<boolean> {
    const t = await Tenant.findOne({where: {id}});
    if (t) {
      const l = await Lease.find({where: {tenantId: id}});
      if (l.length === 0) {
        throw new Error("Tenant doesn't have any leases");
      }

      t.isRentLate = true;
      await t.save();
    }

    return true;
  }

  @Mutation(() => Boolean)
  async unmarkRentAsLate(@Arg('id', () => Int) id: number): Promise<boolean> {
    const t = await Tenant.findOne({where: {id}});
    if (t) {
      const l = await Lease.find({where: {tenantId: id}});
      if (l.length === 0) {
        throw new Error("Tenant doesn't have any leases");
      }
      t.isRentLate = false;
      await t.save();
    }

    return true;
  }


  @FieldResolver(() => Boolean, {name: 'isRentLate'})
  async isRentLate(@Root() tenant: Tenant): Promise<boolean> {
    const now = new Date();
    return this.computeIsLate(tenant.id, now);
  }

  @Query(() => Boolean)
  async isTenantLate(@Arg('id', () => Int) id: number): Promise<boolean> {
    const tenant = await Tenant.findOne({where: {id}});
    if (!tenant) {
      throw new Error(TENANT_ERRORS.INVALID_ID);
    }
    const now = new Date();
    return this.computeIsLate(id, now);
  }

  private async computeIsLate(tenantId: number, at: Date): Promise<boolean> {
    const activeLease = await Lease.findOne({
      where: [
        {tenantId, start: LessThanOrEqual(at), end: MoreThanOrEqual(at)},
        {tenantId, start: LessThanOrEqual(at), end: IsNull()},
      ],
    });

    if (!activeLease) {
      return false;
    }

    const monthStart = startOfMonth(at);
    const monthEnd = endOfMonth(at);

    const dueDate = startOfDay(monthStart);

    // If we're not past the due date yet for that month, it's not late
    if (!isAfter(at, dueDate)) {
      return false;
    }

    const payments = await Payment.find({
      where: {tenantId, paymentDate: Between(monthStart, monthEnd)},
    });

    const monthlyPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return monthlyPaid < (activeLease.rent || 0);
  }
}
