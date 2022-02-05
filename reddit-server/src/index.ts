import 'reflect-metadata'
import { __prod__ } from './constants'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import cors from 'cors'
import session from 'express-session'
import { createConnection } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "reddit2",
    username: "postgres",
    password: "1234",
    synchronize: true,
    logging: true,
    entities: [
      Post,
      User
    ],
  })

  const app = express()

  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({req, res}) => {
      return {req, res}
    } 
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log('serever started on localhost:4000');
  })
}

main().catch((err) => {
  console.error(err)
})