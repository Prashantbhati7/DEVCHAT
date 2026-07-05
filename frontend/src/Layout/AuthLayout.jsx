import { Outlet } from "react-router-dom"



const AuthLayout = () => {
  return (
    <div className="h-full bg-black  flex flex-col">
       <Outlet/>
    </div>
  )
}

export default AuthLayout
