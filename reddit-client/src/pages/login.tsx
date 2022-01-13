import { Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { FC } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import mapToError from '../utils/mapToError'
import Cookies from 'js-cookie'
  
interface Props {

}

const login: FC<Props> = ({}) => {
  const [_, login] = useLoginMutation();
  const router = useRouter()

  return (
    <>
      <Heading as="h1">Login</Heading>
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={async (values, {setErrors}) => {
          console.log('values', values);
          const response = await login(values)
          console.log('response', response);
          
          
          if(response.data?.login.error?.field) {
            setErrors(mapToError(response?.data?.login.error))
          } else {
            if(response.data?.login.cookie_token) {
              Cookies.set('reddituid', response.data?.login.cookie_token)
              router.push('/')
            }
          }
        }}
      >
        {({isSubmitting, }) => (
          <Wrapper>
            <Form>
              <InputField 
                name="username"
                placeholder='Username'
                label='Username'
              />
              <InputField 
                name="password"
                placeholder='Password'
                label='Password'
                type='password'
              />
              <Button
                mt={4}
                colorScheme='teal'
                type='submit'
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Form>
          </Wrapper>
        )}

      </Formik>
    </>
  )
}

export default login