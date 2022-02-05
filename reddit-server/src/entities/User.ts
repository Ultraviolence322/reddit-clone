import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({unique: true})
  username!: string

  @Column()
  password!: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column({unique: true})
  email!: string

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

}