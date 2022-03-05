import { FC, ReactChild, ReactNode } from 'react'
import Navbar from '../components/Navbar'
import Wrapper from '../components/Wrapper'
  
interface Props {
  children: ReactNode
}

const MainLayout: FC<Props> = ({children}) => {
  return (
    <>
    <Navbar />
    <Wrapper variant="reguar">
      {children}
    </Wrapper> 
    </>
  )
}

export default MainLayout