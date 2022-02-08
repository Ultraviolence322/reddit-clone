import { Heading, Button, Box, Link } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import Cookies from 'js-cookie'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import { useState } from 'react'
import InputField from '../../components/InputField'
import Wrapper from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../generated/graphql'
import { createURQLClient } from '../../utils/createURQLClient'
import mapToError from '../../utils/mapToError'
import NextLink from 'next/link'
  
interface Props {
  token: string
}

const changePassword: NextPage<Props> = ({token}) => {
  const router = useRouter()
  const [tokenError, setTokenError] = useState('')
  const [, changePassword] = useChangePasswordMutation()

  return (
    <Wrapper>
      <Heading my={8} as="h1">Change password</Heading>
      <Formik
        initialValues={{newPassword: '', token}}
        onSubmit={async (values, {setErrors}) => {
          const {data} = await changePassword(values)
          
          if (data?.changePassword.error?.field === 'token') {
            setTokenError(data?.changePassword.error?.message)
          } else if (data?.changePassword.error) {
            setErrors(mapToError(data?.changePassword.error))
          } else if (data?.changePassword.user) {
            Cookies.remove('reddituid', {path: ''})
            router.push('/login')
          }
        }}
      >
        {({isSubmitting, }) => (
            <Form>
              <InputField 
                name="newPassword"
                placeholder='Password'
                label='Password'
                type="password"
              />
              {tokenError && 
                <Box>
                  <Box style={{color: "red"}}>{tokenError}</Box>
                  <Box>
                    <NextLink href="/forgot-password">
                      <Link>click here to get a new one</Link>
                    </NextLink>
                  </Box>
                </Box>
              } 
              <Button
                mt={4}
                colorScheme='teal'
                type='submit'
                isLoading={isSubmitting}
              >
                Change password
              </Button>
            </Form>
        )}

      </Formik>
    </Wrapper>
  )
}

changePassword.getInitialProps = ({query}) => {
  return {
    token: query.token as string
  }
}

export default withUrqlClient(createURQLClient)(changePassword)  