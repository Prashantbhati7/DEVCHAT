import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context.jsx';

import axiosInstance from '../config/axios.js';

const Header = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout =async () => {
        await axiosInstance.get('/users/logout',{
            withCredentials: true
        });
        setUser(null);
        navigate('/');
    };

    return (
        <header className="bg-gray-800  fixed top-0 w-full text-white p-4 flex justify-between items-center">
            <div className="text-xl text-white font-bold">
                <Link to="/"><span className='text-red-600'>DEV</span>CHAT</Link>
            </div>
            <nav>
                {user ? (
                    <>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4">
                            Login
                        </Link>
                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
