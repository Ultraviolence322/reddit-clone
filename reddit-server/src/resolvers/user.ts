import argon2d from "argon2";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import CryptoJS from 'crypto-js'
import { parseCookie } from "../utils/parseCookie";
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validRegister } from "../utils/validRegister";

@ObjectType()
class ErrorField {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field({nullable: true})
  error?: ErrorField

  @Field({nullable: true})
  user?: User

  @Field({nullable: true})
  cookie_token?: string
}

@Resolver()
export class UserResolver {
  // @Mutation(() => Boolean)
  // async forgotPassword(
  //   // @Arg("email") email: string,
  //   // @Ctx() { em }: MyContext 
  // ) {
  //   // const user = await em.findOne(User, { email })
  //   return true
  // }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    const cookies = parseCookie(req.headers.cookie)

    if(cookies.reddituid) {
      const bytes  = CryptoJS.AES.decrypt(
        cookies.reddituid, 
        process.env.SECRET_KEY_TO_ENCODE_USER_ID?.toString() || '123haha'
      );
      const originalUserID = bytes.toString(CryptoJS.enc.Utf8);

      const user = await em.findOne(User, {id: +originalUserID})

      return user
    }

    return null
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ) {
    const validResponse = validRegister(options)
    if (validResponse) return {error: validResponse} 

    const hashedPassword = await argon2d.hash(options.password) 
    const user = em.create(User, {
      username: options.username,
      email: options.email,
      password: hashedPassword
    })

    try {
      await em.persistAndFlush(user)
    } catch (error) {
      if(error.code === '23505') {
        return {
          error: {
            field: 'username',
            message: "user already exist"
          }
        }
      }
    }

    return {
      user, 
      cookie_token: CryptoJS.AES.encrypt(
        user.id.toString(), 
        process.env.SECRET_KEY_TO_ENCODE_USER_ID?.toString() || '123haha'
      ).toString()
    } 
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() {em}: MyContext
  ) {
    const user = await em.findOne(User, usernameOrEmail.includes("@") ? {email: usernameOrEmail} : {username: usernameOrEmail})

    if(!user) {
      return {
        error: {
          field: 'usernameOrEmail',
          message: "user doesn't exist"
        }
      }
    }

    const valid = await argon2d.verify(user.password, password)

    if(!valid) {
      return {
        error: {
          field: 'password',
          message: "incorrect password",
        }
      }
    }

    return {
      user, 
      cookie_token: CryptoJS.AES.encrypt(
        user.id.toString(), 
        process.env.SECRET_KEY_TO_ENCODE_USER_ID?.toString() || '123haha'
      ).toString()
    } 
  }

  @Mutation(() => Boolean)
  logout(){
    return true
  }
}