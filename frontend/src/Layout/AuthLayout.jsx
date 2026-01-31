import { Outlet } from "react-router-dom"
import Header from "../components/Header.jsx"


const AuthLayout = () => {
  return (
    <div className="h-full  flex flex-col">
       <Header/>
       <Outlet/>
    </div>
  )
}

export default AuthLayout
