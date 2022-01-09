import { Box } from '@chakra-ui/react'
import { FC } from 'react'
  
interface Props {
  variant?: 'small' | 'reguar'
}

const Wrapper: FC<Props> = ({variant = 'regular', children}) => {
  return (
    <Box 
      mx="auto"
      maxW={variant === 'regular' ? '400px' : '800px'}
    >
      {children}
    </Box>
  )
}

export default Wrapper