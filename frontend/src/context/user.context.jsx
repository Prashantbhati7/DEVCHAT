
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';


// Create the UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


export const useUser = ()=>{
    return useContext(UserContext);
}


