import { NextPage } from 'next'
import {withUrqlClient} from 'next-urql'
import Navbar from '../components/Navbar'
import { createURQLClient } from '../utils/createURQLClient'
import { usePostsQuery } from '../generated/graphql'
import NextLink from 'next/link'
import { Link } from '@chakra-ui/react'
  
interface Props {

}

const index: NextPage<Props> = ({}) => {
  const [{data, fetching}] = usePostsQuery()

  return (
    <div>
      <Navbar />
      <NextLink href="/create-post">
        <Link>Create new post!</Link>
      </NextLink>
      {data && !fetching ? data.posts.map(e => <div key={e.id}>{e.title}</div>) : <div>loading...</div>}
    </div>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(index) 