import { Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import Cookies from 'js-cookie'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { FC } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import { createURQLClient } from '../utils/createURQLClient'
import mapToError from '../utils/mapToError'
  
interface Props {

}

const register: FC<Props> = ({}) => {
  const [_, register] = useRegisterMutation();
  const router = useRouter()

  return (
    <>
      <Heading as="h1">Register</Heading>
      <Formik
        initialValues={{username: '', password: ''}}
        onSubmit={async (values, {setErrors}) => {
          const response = await register(values)
          
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

export default withUrqlClient(createURQLClient)(register)  