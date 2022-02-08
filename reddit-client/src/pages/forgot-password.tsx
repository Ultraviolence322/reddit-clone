import { Button, Heading } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import { useState } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useForgotPasswordMutation } from '../generated/graphql'
import { createURQLClient } from '../utils/createURQLClient'
  
interface Props {

}

const forgotPassword: NextPage<Props> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation()
  const [doneMessage, setDoneMessage] = useState('')

  return (
    <Wrapper>
      <Heading my={8} as="h1">Forgot password</Heading>
      <Formik
        initialValues={{email: ''}}
        onSubmit={async (values, {setErrors}) => {
          await forgotPassword(values)
          setDoneMessage('if email exists you will receive the link to reset the password')
        }}
      >
        {({isSubmitting, }) => (
            doneMessage 
              ? doneMessage
              : <Form>
                  <InputField 
                    name="email"
                    placeholder='Email'
                    label='Email'
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

export default withUrqlClient(createURQLClient)(forgotPassword)  