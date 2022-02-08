import { Box, Button, Heading, Link } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { NextPage } from 'next'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import mapToError from '../utils/mapToError'
import Cookies from 'js-cookie'
import { withUrqlClient } from 'next-urql'
import { createURQLClient } from '../utils/createURQLClient'
import NextLink from 'next/link'
  
interface Props {

}

const login: NextPage<Props> = ({}) => {
  const [_, login] = useLoginMutation();
  const router = useRouter()
  const pushPath = router.query.next ? router.query.next.toString() : '/'

  return (
    <>
      <Heading as="h1">Login</Heading>
      <Formik
        initialValues={{usernameOrEmail: '', password: ''}}
        onSubmit={async (values, {setErrors}) => {
          const response = await login(values)
          
          if(response.data?.login.error?.field) {
            setErrors(mapToError(response?.data?.login.error))
          } else {
            if(response.data?.login.cookie_token) {
              Cookies.set('reddituid', response.data?.login.cookie_token)
              router.push(pushPath)
            }
          }
        }}
      >
        {({isSubmitting, }) => (
          <Wrapper>
            <Form>
              <InputField 
                name="usernameOrEmail"
                placeholder='Username or Email'
                label='Username or Email'
              />
              <InputField 
                name="password"
                placeholder='Password'
                label='Password'
                type='password'
              />
              <Box mt="3">
                <NextLink href="/forgot-password">
                  <Link>Forgot the password?</Link>
                </NextLink>
              </Box>
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

export default withUrqlClient(createURQLClient)(login)  