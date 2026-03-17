import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../config/axios'
import { UserContext } from '../context/user.context'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

const Login = () => {


    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const { setUser } = useContext(UserContext)
    const [error,seterror] = useState(null);
    const navigate = useNavigate()
    const [scale,setScale] = useState(false);
    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/login', {
            email,
            password,
        },{
            withCredentials: true
        }).then((res) => {
           // console.log(res.data)
            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
            seterror(err.response.data.errors);
        })
    }
    const hideerror = async()=>{
        const promise = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve();
            },2000)
        })
        await promise;
        seterror(null);
    }
    useEffect(()=>{
        if (error){
            hideerror();
        }
    },[error])

    return (
        <div className='min-h-screen h-[90vh] bg-black'>
         <div className={`relative top-1/2 translate-y-[-50%] flex flex-col justify-center  mx-auto ${scale?'w-[90%] h-[90%]':'w-[50%] h-[50%]'} bg-[#050c05] border border-green-900/40 rounded-2xl overflow-hidden shadow-2xl shadow-green-900/20 group`}>
                        <div className="absolute border-b-gray-400 border-b top-0 w-full h-8 bg-black   border-green-900/30 flex items-center px-4 gap-2">
                           <button onClick={()=> navigate('/')} className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-red-500/80 transition-colors"></button>
                           <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-yellow-500/80 transition-colors"></div>
                           <button onClick={()=> setScale(!scale)} className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors"></button>
                           <div className="ml-4 text-xs font-mono text-green-700 group-hover:text-green-500 transition-colors">terminal ~ Login </div>
                        </div>
                      
               <form className='px-4 ' onSubmit={submitHandler}>
                    <div className={`mb-4 w-full px-4 flex flex-col  justify-center ${scale && 'scale-y-110 pb-10 '} `}>
                         <div className="text-red-500 font-semibold mt-2 text-center w-full p-3 h-11 focus:outline-none">{error ? "Error ~ enter valid credentials" : ""}</div>
                        <label className="block text-white font-mono font-bold w-full  mb-2" htmlFor="email">~Email</label>
                        <input

                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className=" w-full mx-auto p-3 bg-black  font-mono focus:border-none focus:outline-none acitve:ring-green-950 placeholder:text-green-700 placeholder:font-mono text-green-700"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className={`mb-6 px-4  ${scale && 'scale-y-110 pb-10'} `}>
                        <label className="block text-white font-mono font-bold  mb-2" htmlFor="password">~Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-2xl placeholder:text-green-700 font-mono text-green-700 bg-black   focus:outline-none "
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className='w-full flex justify-center'>
                    <button
                        type="submit"
                        className="p-3 px-10 rounded-full  bg-green-500 text-black font-bold max-w-3xl mx-auto overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3"
                    >
                        Login
                    </button>
                    </div>
                     <p className="text-gray-400  px-4 mt-4">
                    Don't have an account? <Link to="/register" className="text-green-500 hover:underline">Register</Link>
                    </p>
                </form>
        </div>
        </div>
            
    )
}

export default Login