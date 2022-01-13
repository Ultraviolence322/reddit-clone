import { Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/router'
import { FC } from 'react'
import InputField from '../components/InputField'
import Wrapper from '../components/Wrapper'
import { useRegisterMutation } from '../generated/graphql'
import mapToError from '../utils/mapToError'
  
interface Props {

}

const register: FC<Props> = ({}) => {
  const [_, register] = useRegisterMutation();
  const router = useRouter()

  return (
    <Formik
      initialValues={{username: '', password: ''}}
      onSubmit={async (values, {setErrors}) => {
        console.log('values', values);
        const response = await register(values)
        
        if(response?.data?.register.error?.field) {
          setErrors(mapToError(response?.data?.register.error))
        } else {
          router.push('/')
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
  )
}

export default register