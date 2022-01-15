import { FC } from 'react'
import {withUrqlClient} from 'next-urql'
import Navbar from '../components/Navbar'
import { createURQLClient } from '../utils/createURQLClient'
import { usePostsQuery } from '../generated/graphql'
  
interface Props {

}

const index: FC<Props> = ({}) => {
  const [{data, fetching}] = usePostsQuery()

  return (
    <div>
      <Navbar />
      hi
      {data && !fetching ? data.posts.map(e => <div key={e.id}>{e.title}</div>) : <div>loading...</div>}
    </div>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(index) 