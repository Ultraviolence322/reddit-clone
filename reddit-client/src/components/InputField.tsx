import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react'
import { useField } from 'formik'
import { FC, InputHTMLAttributes } from 'react'
  
type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label: string
}

const InputField: FC<Props> = ({label, size:_, ...props}) => {
  const [field, {error}] = useField(props)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField