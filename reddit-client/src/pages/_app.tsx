import { FC } from 'react'
import { ChakraProvider } from '@chakra-ui/react'

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
