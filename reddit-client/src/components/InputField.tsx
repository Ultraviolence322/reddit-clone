import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react'
import { useField } from 'formik'
import { FC, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
  
type Props = InputHTMLAttributes<HTMLInputElement> 
  & TextareaHTMLAttributes<HTMLTextAreaElement> 
  & {
  name: string,
  label: string,
  textarea?: boolean
}

const InputField: FC<Props> = ({textarea, label, size:_, ...props}) => {
  const [field, {error}, ] = useField(props)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      {
        textarea 
        ? <Textarea {...field} {...props} id={field.name} />
        : <Input {...field} {...props} id={field.name} />
      }
      
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}

export default InputField