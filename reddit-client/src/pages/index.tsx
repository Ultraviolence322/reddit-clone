import { NextPage } from 'next'
import {withUrqlClient} from 'next-urql'
import Navbar from '../components/Navbar'
import { createURQLClient } from '../utils/createURQLClient'
import { usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
  
interface Props {

}

const index: NextPage<Props> = ({}) => {
  const [{data, fetching}] = usePostsQuery({
    variables: {
      limit: 10
    }
  })

  return (
    <div>
      <Navbar />
      <Wrapper variant="reguar">
        <NextLink href="/create-post">
          <Link>Create new post!</Link>
        </NextLink>
        <Stack spacing={8}>
          {data && !fetching 
            ? data.posts.map(post => <Box key={post.id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>

            ) 
            : <div>loading...</div>
        }
        </Stack>
        
        <Flex>
          <Button mx="auto" my={8}>Load more</Button>
        </Flex>
      </Wrapper>
      
    </div>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(index) 