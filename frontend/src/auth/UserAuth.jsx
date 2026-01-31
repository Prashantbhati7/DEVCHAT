import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axiosInstance from '../config/axios'

const UserAuth = ({ children }) => {

    const { user ,setUser} = useContext(UserContext)
    const [ loading, setLoading ] = useState(true)
    //const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const getCurrentUser = async()=>{
                    try{
                        console.log("user is now ",user);
                        const currentUser = await axiosInstance.get('/users/curr-user',{
                            withCredentials: true
                        })
                        console.log("curr user is ",currentUser);
                        setUser(currentUser.data.user);
                        console.log(currentUser.data.user);
                    }catch(err){
                        console.log(err)
                        setUser(null);
                        navigate('/login')
                    }
                }


    useEffect(() => {
        if (user) {
            setLoading(false)
        }

        // if (!token) {
        //     navigate('/login')
        // }

        else if (!user) {
            const curruser = getCurrentUser();
            if (curruser){
                setUser(curruser);
                setLoading(false);
            }else{
                navigate('/login')
            }
        }

    }, [])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            {children}</>
    )
}

export default UserAuth