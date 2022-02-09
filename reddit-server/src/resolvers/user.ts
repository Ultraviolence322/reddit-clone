import argon2d from "argon2";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root} from "type-graphql";
import CryptoJS from 'crypto-js'
import { UsernamePasswordInput } from "../utils/UsernamePasswordInput";
import { validRegister } from "../utils/validRegister";
import {v4} from "uuid"
import { sendEmail } from "../utils/sendEmail";
import { getConnection } from "typeorm";
import { getUserIdFromCookie } from "../utils/getUserIdFromCookie";

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



@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() {req}: MyContext) {
    const currentUserId = getUserIdFromCookie(req)
    if(currentUserId === user.id) {
      return user.email
    }

    return ""
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() {req}: MyContext
  ) {
    if (newPassword.length <= 2) {
      return {
        error: {
          field: 'newPassword',
          message: "password length should be greater than 2"
        }
      };
    }
    
    if(!req.session.forgetPassword) req.session.forgetPassword = {}
    const userId = req.session.forgetPassword[token]
    
    if(!userId) {
      return {
        error: {
          field: 'token',
          message: "token doesn't exist or expired",
        }
      }
    }

    const user = await User.findOne(userId)
    if(!user) {
      return {
        error: {
          field: 'token',
          message: "user is no longer exist",
        }
      }
    }

    await User.update({id: userId}, {
      password: await argon2d.hash(newPassword) 
    })
    
    req.session.forgetPassword[token] = null

    return {user}
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { req }: MyContext 
  ) {
    const user = await User.findOne({ where: {email}})

    if(!user) return true

    const token = v4()
    if(!req.session.forgetPassword) {
      req.session.forgetPassword = {}
    }
    req.session.forgetPassword[token] = user.id

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">
        reset password
      </a>`
    )
    return true
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    const originalUserID = getUserIdFromCookie(req)
    
    if(originalUserID) {
      const user = await User.findOne({
        where: {
          id: originalUserID
        }
      })

      return user
    } else {
      return null
    }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
  ) {
    const validResponse = validRegister(options)
    if (validResponse) return {error: validResponse} 

    const hashedPassword = await argon2d.hash(options.password) 
    
    let user = {} as any
    try {
      const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: options.username,
          email: options.email,
          password: hashedPassword
        }
      ])
      .returning('*')
      .execute();

      user = result.raw[0]
    } catch (error) {
      if(error.code === '23505') {
        return {
          error: {
            field: 'username',
            message: "user already exist, maybe email is reserved"
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
  ) {
    const user = await User.findOne(usernameOrEmail.includes("@") ? {where: {email: usernameOrEmail}} : {where: {username: usernameOrEmail}})

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
  logout(
    @Ctx() { res }: MyContext
  ){
    res.clearCookie('reddituid')
    return true
  }
}