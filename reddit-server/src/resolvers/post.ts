import { Post } from "../entities/Post";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { getUserIdFromCookie } from "../utils/getUserIdFromCookie";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]

  @Field()
  hasMore: boolean
}

@InputType()
class PostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50) + '...'
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, {nullable: true}) cursor: string,
  ) {
    const realLimit = Math.min(50, limit)
    const realLimitPlusOne = Math.min(50, limit) + 1
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimitPlusOne)

    if(cursor) {
      qb.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor))
      })
    }
    const posts = await qb.getMany()

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    }
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