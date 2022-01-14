import { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import {cacheExchange, Cache, QueryInput} from '@urql/exchange-graphcache'
import { LoginMutation, LogoutMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query,
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache, 
              {query: MeDocument},
              _result,
              () => ({ me: null})
            )
          },

          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache, 
              {query: MeDocument},
              _result,
              (result, query) => {
                if(result.login.error) {
                  return query
                } else {
                  return {
                    me: result.login.user
                  }
                }
              }
            )
          },

          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache, 
              {query: MeDocument},
              _result,
              (result, query) => {
                if(result.register.error) {
                  return query
                } else {
                  return {
                    me: result.register.user
                  }
                }
              }
            )
          }
        }
      }
    }),
    fetchExchange,
  ],
});

interface Props {
  Component: any;
  pageProps: any;
}

const _app: FC<Props> = ({ Component, pageProps }) => {
return (
  <Provider value={client}>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </Provider>
)}

export default _app
