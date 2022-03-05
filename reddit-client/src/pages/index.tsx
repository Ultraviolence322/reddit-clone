import { NextPage } from 'next'
import {withUrqlClient} from 'next-urql'
import { createURQLClient } from '../utils/createURQLClient'
import { DeletePostDocument, useDeletePostMutation, usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import UpdootSection from '../components/UpdootSection'
import MainLayout from '../layouts/MainLayout'
import { DeleteIcon } from '@chakra-ui/icons'
  
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
  const [{fetching: deletingPost}, deletePost] = useDeletePostMutation()
  const [idForDelete, setIdForDelete] = useState(0)

  const deletePostHandler = async (id: number) => {
    setIdForDelete(id)
    await deletePost({id})
  }

  return (
    <MainLayout>
      <NextLink href="/create-post">
          <Link>Create new post!</Link>
        </NextLink>
        <Stack spacing={8}>
          {data && !fetching 
            ? data.posts.posts.map(post => <Box key={post.id} p={5} shadow='md' borderWidth='1px'>
              <Flex>
                <UpdootSection post={post} />
                <Box>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize='xl'>{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text mt={4}>{post.textSnippet}</Text>
                  <Text mt={8}>Author: {post.creator.username}</Text>
                </Box>
                <Box marginLeft={"auto"} marginRight={0}>
                  <Button 
                    isLoading={deletingPost && idForDelete === post.id} 
                    _hover={{backgroundColor: "tomato"}} 
                    onClick={() => deletePostHandler(post.id)}
                  >
                    <DeleteIcon/>
                  </Button>
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
    </MainLayout>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(index) 