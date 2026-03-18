
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';


// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

    const [ user, setUser ] = useState(null);
    const [loading,setLoading] = useState(false);
    // const fetchUser = async()=>{
    //     const response = await axios.get('http://localhost:8080/users/curr-user',{
    //         withCredentials: true
    //     });
    //     console.log("user is ",response.data.user);
    //     setUser(response.data.user);
    // }
    // useEffect(()=>{
    //     setLoading(true);
    //     try{
    //         fetchUser();
    //     }
    //     catch(error){
    //         console.log(error);
    //         setUser(null);
    //     }
    //     finally{
    //         setLoading(false);
    //     }
    // },[])

    const fetchUser = async()=>{
        setLoading(true);
        try{
            const response = await axios.get('http://localhost:8080/users/curr-user',{
                withCredentials: true , headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }});
            console.log("user is ",response.data.user);
            setUser(response.data.user);
        }
        catch(error){
            console.log(error);
            setUser(null);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchUser();
    },[])
    return (
        <UserContext.Provider value={{ user, setUser,loading,setLoading,fetchUser}}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = ()=>{
    return useContext(UserContext);
}


