import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context.jsx';

import axiosInstance from '../config/axios.js';

const Header = () => {
    const { user, setUser,loading} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout =async () => {
        await axiosInstance.get('/users/logout',{
            withCredentials: true
        });
        setUser(null);
        navigate('/');
    };
    if (loading)return  <></>;
    return (
        <header className="bg-[#091509]  fixed top-0 w-full text-white p-4 flex justify-between items-center">
            <div className="text-xl text-white font-bold">
                <Link to="/"><span className='text-transparent bg-clip-text bg-gradient-to-br from-green-300 via-emerald-400 to-green-700'>DEV</span>CHAT</Link>
            </div>
            <nav>
                {user ? (
                    <>
                        <button
                            onClick={handleLogout}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <div className='flex gap-4'>
                        <Link to="/register" className='text-transparent bg-clip-text bg-gradient-to-br from-green-300 cursor-pointer via-emerald-400 to-green-700'>
                         <span className='p-2 rounded-2xl'>Register</span> </Link>
                        <Link  to="/login" className='text-transparent bg-clip-text bg-gradient-to-br from-green-300 cursor-pointer via-emerald-400 to-green-700'>Login</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
