import argon2d from "argon2";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver} from "type-graphql";
import CryptoJS from 'crypto-js'

const parseCookie = (str: string): any => {
  const result: any = {}
  
  str
  .split(';')
  .map(v => v.split('='))
  .forEach(e => {
    result[e[0].trim()] = e[1].trim() 
  })

  return result
}

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

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
    if(options.username.length <= 2) {
      return {
        error: {
          field: 'username',
          message: "username length should be greater than 2"
        }
      }
    }

    if(options.password.length <= 2) {
      return {
        error: {
          field: 'password',
          message: "password length should be greater than 2"
        }
      }
    }

    const hashedPassword = await argon2d.hash(options.password) 
    const user = em.create(User, {
      username: options.username,
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
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ) {
    const user = await em.findOne(User, {username: options.username})

    if(!user) {
      return {
        error: {
          field: 'username',
          message: "user does't exist"
        }
      }
    }

    const valid = await argon2d.verify(user.password, options.password)

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
}