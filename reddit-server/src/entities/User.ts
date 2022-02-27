import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @OneToMany(() => Updoot, updoot => updoot.user)
  updoots: Updoot[];

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