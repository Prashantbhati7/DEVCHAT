
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';
import Loading from '../screens/Loading';


// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setLoading(true);
        try {
            const response = await axios.get('/users/curr-user', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        catch (error) {
            console.log(error);
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, loading, setLoading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = ()=>{
    return useContext(UserContext);
}


