import argon2d from "argon2";
import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql";

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
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() {em}: MyContext
  ) {
    if(options.password.length <= 3) {
      return {
        error: {
          field: 'password',
          message: "password length should be greater than 3"
        }
      }
    }
    if(options.username.length <= 3) {
      return {
        error: {
          field: 'username',
          message: "username length should be greater than 3"
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

    return {user}
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
          field: 'user',
          message: "user does't exist"
        }
      }
    }

    const valid = await argon2d.verify(user.password, options.password)

    if(!valid) {
      return {
        error: {
          field: 'password',
          message: "incorrect password"
        }
      }
    }

    return {user} 
  }
}