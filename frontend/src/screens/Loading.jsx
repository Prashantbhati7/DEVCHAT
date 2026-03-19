
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'
const Loading = () => {
  return (
    <div className='min-h-screen bg-black flex items-center text-2xl justify-center'>
       <Bouncy
        size="80"
        speed="1.75"
        color="green" 
        />
    </div>
  )
}

export default Loading;
