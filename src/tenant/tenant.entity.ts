import {ObjectType, Field, Int} from 'type-graphql';
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@ObjectType()
@Entity()
class Tenant extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({unique: true})
  email!: string;

  @Field({nullable: true})
  @Column({nullable: true})
  isRentLate?: boolean | null;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Tenant;
