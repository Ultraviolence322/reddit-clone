import { Heading, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { FC } from 'react'
import InputField from '../components/InputField'
import { useCreatePostMutation } from '../generated/graphql'
import { withUrqlClient } from 'next-urql'
import { createURQLClient } from '../utils/createURQLClient'
import { useRouter } from 'next/router'
import { useIsAuth } from '../hooks/useIsAuth'
import MainLayout from '../layouts/MainLayout'
  
interface Props {

}

const createPost: FC<Props> = ({}) => {
  const [_, createPost] = useCreatePostMutation()
  const router = useRouter()
  useIsAuth()

  return (
    <MainLayout>
      <Heading my={8} as="h1">Create Post</Heading>
      <Formik
        initialValues={{title: '', text: ''}}
        onSubmit={async (values, {setErrors}) => {
          const {error} = await createPost({input: values})
          if(!error) router.push('/')
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
                Create post
              </Button>
            </Form>
        )}
      </Formik>
    </MainLayout>
  )
}

export default withUrqlClient(createURQLClient)(createPost)