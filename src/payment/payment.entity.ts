import {ObjectType, Field, Int, Float} from 'type-graphql';
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Relation, ManyToOne} from 'typeorm';
import Tenant from '../tenant/tenant.entity';

@ObjectType()
@Entity()
class Payment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  paymentDate!: Date;

  @Field(() => Float)
  @Column({type: 'float'})
  amount!: number;

  /* Belongs to tenant */
  @ManyToOne(() => Tenant, {nullable: true})
  private tenant?: Relation<Tenant> | null;

  @Column()
  tenantId!: number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  async getTenant(): Promise<Tenant> {
    const tenant = this.tenant || (await Tenant.findOneOrFail({where: {id: this.tenantId}}));
    this.tenant = tenant;

    return tenant;
  }
}

export default Payment;
