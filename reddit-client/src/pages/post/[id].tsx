import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { usePostQuery } from '../../generated/graphql'
import { useGetPostById } from '../../hooks/useGetPostById'
import MainLayout from '../../layouts/MainLayout'
import { createURQLClient } from '../../utils/createURQLClient'
  
interface Props {
}

const PostPage: FC<Props> = (props) => {
  const [{data}] = useGetPostById()
  
  return (
    <MainLayout>
      {data?.post?.text}
    </MainLayout>
  )
}

export default withUrqlClient(createURQLClient, {ssr: true})(PostPage)  