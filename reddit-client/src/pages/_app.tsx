import { ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';

interface Props {
  Component: any;
  pageProps: any;
}

const _app: FC<Props> = ({ Component, pageProps }) => {
return (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
)}

export default _app
