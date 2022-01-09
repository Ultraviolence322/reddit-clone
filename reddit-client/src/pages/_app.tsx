import { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createClient, Provider } from 'urql';

const client = createClient({
  url: 'http://localhost:4000/graphql',
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
