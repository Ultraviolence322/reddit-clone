import { Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { FC } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
  
interface Props {

}

const register: FC<Props> = ({}) => {
  return (
    <Formik
      initialValues={{username: '', password: ''}}
      onSubmit={(values, actions) => {
        console.log('values', values);
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
  )
}

export default register