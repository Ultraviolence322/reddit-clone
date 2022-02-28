import { Button, Flex } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { FC } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'
  
interface Props {
  post: PostSnippetFragment
}

const UpdootSection: FC<Props> = ({post}) => {
  const [{fetching}, vote] = useVoteMutation()

  return (
    <Flex 
      direction={'column'} 
      alignItems={'center'} 
      justifyContent={'center'}
      mr={4}
    >
      <Button 
        onClick={() => vote({
          value: 1,
          postId: post.id
        })}
        isLoading={fetching}
      >
        <ChevronUpIcon />
      </Button>
        {post.points}
      <Button 
        onClick={() => vote({
          value: -1,
          postId: post.id
        })}
        isLoading={fetching}
      >
        <ChevronDownIcon />
      </Button>
    </Flex>
  )
}

export default UpdootSection