import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'


const Register = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [error,seterror] = useState(null);
    const { setUser } = useContext(UserContext)

    const navigate = useNavigate()


    function submitHandler(e) {

        e.preventDefault()

        axios.post('/users/register', {
            email,
            password
        },{
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
            //localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data)
            seterror(err.response.data);
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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-black to-gray-700">
            <div className="bg-gradient-to-b from-black to-gray-700 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
                {error && <p className="text-red-500 mt-2 text-center w-full p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500">{error}</p>}
                <form
                    onSubmit={submitHandler}
                >
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-2xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-2xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
                <p className="text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register