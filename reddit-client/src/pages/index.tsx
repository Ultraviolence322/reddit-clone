import { NextPage } from 'next'
import {withUrqlClient} from 'next-urql'
import Navbar from '../components/Navbar'
import { createURQLClient } from '../utils/createURQLClient'
import { usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import { useState } from 'react'
import UpdootSection from '../components/UpdootSection'
  
interface Props {

}

const index: NextPage<Props> = ({}) => {
  const [variables, setVariables] = useState({
    limit: 33,
    cursor: null as null | string,
  })
  const [{data, fetching}] = usePostsQuery({
    variables
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
            ? data.posts.posts.map(post => <Box key={post.id} p={5} shadow='md' borderWidth='1px'>
              <Flex>
                <UpdootSection post={post} />
                <Box>
                  <Heading fontSize='xl'>{post.title}</Heading>
                  <Text mt={4}>{post.textSnippet}</Text>
                  <Text mt={8}>Author: {post.creator.username}</Text>
                </Box>
              </Flex>
            </Box>

            ) 
            : <div>loading...</div>
        }
        </Stack>
        
        <Flex>
          {
            data?.posts.hasMore && <Button 
                mx="auto" my={8}
                isLoading={fetching}
                onClick={() => {
                  setVariables({
                    limit: variables.limit,
                    cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                  });
                }}
              >Load more</Button>
          }
        </Flex>
      </Wrapper>
      
    </div>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(index) 