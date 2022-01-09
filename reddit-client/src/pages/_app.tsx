import { FC } from 'react'
  
interface Props {
  Component: any;
  pageProps: any;
}

const _app: FC<Props> = ({ Component, pageProps }) => {
return (
  <Component {...pageProps} />
)}

export default _app
