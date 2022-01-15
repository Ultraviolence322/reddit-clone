import { ChakraProvider } from '@chakra-ui/react';
import { NextPage } from 'next';

interface Props {
  Component: any;
  pageProps: any;
}

const _app: NextPage<Props> = ({ Component, pageProps }) => {
return (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
)}

export default _app
