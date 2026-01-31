import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user.context"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axios";

const Header = () => {
    const navigate = useNavigate();
    const {user,setUser }= useContext(UserContext);
    const [loading,setLoading] = useState(true);
     const getCurrentUser = async()=>{
                    try{
                       // console.log("user is now ",user);
                        const currentUser = await axiosInstance.get('/users/curr-user',{
                            withCredentials: true
                        })
                        //console.log("curr user is ",currentUser);
                        setUser(currentUser.data.user);
                        
                    }catch(err){
                        console.log(err)
                        setUser(null);
                        navigate('/login')
                    }
        }
        useEffect(()=>{
            if (user){
                setLoading(false)
            }
            if (!user){
                const curruser = getCurrentUser();
                if (curruser){
                    setUser(curruser);
                    setLoading(false);
                }
            }
        },[])
    {loading && <div>Loading...</div>}
    {!loading && ( <div className="header">
         
    </div> )}
}

export default Header
