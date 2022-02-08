import { Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import Cookies from 'js-cookie'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { createURQLClient } from '../utils/createURQLClient'
import mapToError from '../utils/mapToError'
  
interface Props {

}

const register: NextPage<Props> = ({}) => {
  const [_, register] = useRegisterMutation();
  const router = useRouter()

  return (
    <Wrapper>
      <Heading my={8} as="h1">Register</Heading>
      <Formik
        initialValues={{username: '', email: '', password: ''}}
        onSubmit={async (values, {setErrors}) => {
          const response = await register({options: values})
          
          if(response?.data?.register.error?.field) {
            setErrors(mapToError(response?.data?.register.error))
          } else {
            if(response.data?.register.cookie_token) {
              Cookies.set('reddituid', response.data?.register.cookie_token)
              router.push('/')
            }
          }
        }}
      >
        {({isSubmitting, }) => (
            <Form>
              <InputField 
                name="email"
                placeholder='Email'
                label='Email'
              />
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
        )}

      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createURQLClient)(register)  