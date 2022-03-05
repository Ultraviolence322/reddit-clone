import { Heading, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { FC } from 'react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { useUpdatePostMutation } from '../../generated/graphql'
import { useGetPostById } from '../../hooks/useGetPostById'
import { useGetIntId } from '../../utils/useGetIntId'
import InputField from '../../components/InputField'
import MainLayout from '../../layouts/MainLayout'
import { createURQLClient } from '../../utils/createURQLClient'
  
interface Props {

}

const EditPost: FC<Props> = ({}) => {
  const [{data, fetching}] = useGetPostById()
  const [_, updatePost] = useUpdatePostMutation()
  const router = useRouter()
  const intId = useGetIntId()

  if (fetching) {
    return (
      <MainLayout>
        <div>loading...</div>
      </MainLayout>
    );
  }

  if (!data?.post) {
    return (
      <MainLayout>
        <div>could not find post</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Heading my={8} as="h1">Update Post</Heading>
      <Formik
        initialValues={{title: data.post.title, text: data.post.text}}
        onSubmit={async (values) => {
          await updatePost({id: intId, ...values})
          router.back()
        }}
      >
        {({isSubmitting}) => (
            <Form>
              <InputField 
                name="title"
                placeholder='Title'
                label='Title'
              />
              <InputField 
                name="text"
                placeholder='Text...'
                label='Text'
                textarea
              />
              <Button
                mt={4}
                colorScheme='teal'
                type='submit'
                isLoading={isSubmitting}
              >
                Update post
              </Button>
            </Form>
        )}
      </Formik>
    </MainLayout>
  )
}

export default withUrqlClient(createURQLClient)(EditPost)