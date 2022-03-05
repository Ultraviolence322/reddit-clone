import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { usePostQuery } from '../../generated/graphql'
import MainLayout from '../../layouts/MainLayout'
import { createURQLClient } from '../../utils/createURQLClient'
  
interface Props {
}

const PostPage: FC<Props> = (props) => {
  const router = useRouter()
  const idToFetch = router.query.id ? +router.query.id : -1
  const [{data, error, fetching}] = usePostQuery({
    pause: idToFetch === -1,
    variables: {
      id: idToFetch
    }
  })
  
  return (
    <MainLayout>
      {data?.post?.text}
    </MainLayout>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(PostPage)  