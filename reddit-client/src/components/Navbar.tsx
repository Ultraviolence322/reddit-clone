import { Box, Flex, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { FC } from 'react'
import { useMeQuery } from '../generated/graphql'
  
interface Props {

}

const Navbar: FC<Props> = ({}) => {
  const [{data, fetching}] = useMeQuery()
  let body = null
  
  if(fetching) {

  } else if(data?.me?.username) {
    body = data?.me?.username
  } else if (!data?.me){
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink><NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    )
  }

  return (
    <Flex bg="tomato" p={4}>
      <Box ml="auto" > 
        {body}
      </Box>
    </Flex>
  )
}

export default Navbar