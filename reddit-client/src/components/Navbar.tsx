import { Box, Button, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FC } from 'react'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { isServer } from '../utils/isServer'
  
interface Props {

}

const Navbar: FC<Props> = ({}) => {
  const [{data, fetching}] = useMeQuery({
    pause: isServer()
  })
  
  const [{fetching: logoutFetching}, logout] = useLogoutMutation()
  let body = null
  
  if(fetching || isServer()) {

  } else if(data?.me?.username) {
    body = (
      <>
        {data?.me?.username}
        <Button variant="link" isLoading={logoutFetching} ml="2" onClick={() => logout()}>Logout</Button>
      </>
    )  
  } else if (!data?.me){
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  )
}

export default Navbar