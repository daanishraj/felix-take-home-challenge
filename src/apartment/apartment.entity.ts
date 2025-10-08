import {ObjectType, Field, Int} from 'type-graphql';
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@ObjectType()
@Entity()
class Apartment extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique: true})
  name!: string;

  @Field()
  @Column({unique: true})
  address!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;
}

export default Apartment;
