import { Post } from "../entities/Post";
import { Arg, Ctx, Field, InputType, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { getUserIdFromCookie } from "../utils/getUserIdFromCookie";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, {nullable: true}) cursor: string,
  ) {
    const realLimit = Math.min(50, limit)
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit)

    if(cursor) {
      qb.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor))
      })
    }

    return qb.getMany()
  }

  @Query(() => Post, {nullable: true})
  post(
    @Arg("id") id: number,
  ) {
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() {req}: MyContext
  ) {
    const originalUserID = getUserIdFromCookie(req)
    
    return Post.create({
      ...input,
      creatorId: originalUserID as number
    }).save()
  }

  @Mutation(() => Post, {nullable: true})
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
  ) {
    const post = await Post.findOne(id)

    if (post) {
      await Post.update({id}, {title})
    } else {
      return null
    }

    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
  ) {
    await Post.delete(id)
    return true
  }
}