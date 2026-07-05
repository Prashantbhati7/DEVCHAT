import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
import { motion } from 'framer-motion';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import BackgroundGrid from '../components/BackgroundGrid';
import { Terminal, Shield, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setLoading } = useContext(UserContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isFullscreen, setIsFullscreen] = useState(false);

    function submitHandler(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        axios.post('/users/login', {
            email,
            password,
        }, {
            withCredentials: true
        }).then((res) => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setLoading(false);
            navigate('/MyGD');
        }).catch((err) => {
            setLoading(false);
            let msg = 'Something went wrong. Please try again.';
            if (err?.response) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    msg = data;
                } else if (data && typeof data === 'object') {
                    if (data.errors) {
                        if (typeof data.errors === 'string') {
                            msg = data.errors;
                        } else if (Array.isArray(data.errors)) {
                            msg = data.errors.map(e => e.msg).filter(Boolean).join(', ') || 'Validation error';
                        }
                    } else if (data.message) {
                        msg = data.message;
                    }
                }
            } else if (err?.message) {
                msg = err.message;
            }
            setError(msg);
        });
    }

    function handleGoogleSignIn() {
        setError(null);
        setLoading(true);
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                axios.post('/users/google-auth', {
                    email: user.email
                }, {
                    withCredentials: true
                }).then((res) => {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setUser(res.data.user);
                    setLoading(false);
                    navigate('/MyGD');
                }).catch((err) => {
                    setLoading(false);
                    let msg = 'Failed to sync with backend after Google Auth.';
                    if (err?.response) {
                        const data = err.response.data;
                        if (typeof data === 'string') {
                            msg = data;
                        } else if (data && typeof data === 'object') {
                            if (data.errors) {
                                if (typeof data.errors === 'string') {
                                    msg = data.errors;
                                } else if (Array.isArray(data.errors)) {
                                    msg = data.errors.map(e => e.msg).filter(Boolean).join(', ');
                                }
                            } else if (data.message) {
                                msg = data.message;
                            }
                        }
                    }
                    setError(msg);
                });
            })
            .catch((err) => {
                setLoading(false);
                setError(err.message || 'Google Auth Popup closed or failed.');
            });
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-dev-bg p-6 overflow-hidden">
            <BackgroundGrid />

            {/* Glowing Accent Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-dev-green/5 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className={`relative w-full ${isFullscreen ? 'max-w-7xl h-[85vh]' : 'max-w-lg'} bg-[#08110C]/90 backdrop-blur-md border border-emerald-950/60 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 z-10`}
            >
                {/* OS Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0C160F] border-b border-emerald-950/40">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate('/')} className="w-3 h-3 rounded-full bg-[#FF5D73]/80 hover:bg-[#FF5D73] transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-[#FFC857]/80 cursor-default" />
                        <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-3 h-3 rounded-full bg-[#37E88F]/80 hover:bg-[#37E88F] transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-dev-green/70">
                        <Terminal size={12} />
                        <span>devchat@system: ~login</span>
                    </div>
                    <div className="w-14" /> {/* Spacer */}
                </div>

                {/* Form and Content */}
                <div className="p-8">
                    <div className="mb-6 font-mono text-xs text-dev-text-sec leading-relaxed">
                        <p className="text-dev-green">DEVCHAT OS v1.0.0 Initialized.</p>
                        <p>Loading security protocols... [OK]</p>
                        <p>Establishing user authentication handshake...</p>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-dev-text mb-6 font-sans uppercase">
                        Authenticate Session
                    </h2>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-start gap-2.5 text-dev-danger font-mono text-xs mb-6 p-4 bg-dev-danger/10 border border-dev-danger/30 rounded-lg"
                        >
                            <span className="font-bold">🚨 [ERR]</span>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono text-dev-text-sec mb-1.5" htmlFor="email">
                                devchat:~$ login --email
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-dev-green/50 font-mono text-sm">➜</span>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full pl-8 pr-4 py-3 bg-black/60 border border-emerald-950/40 rounded-lg text-dev-green font-mono placeholder-emerald-950 text-sm focus:border-dev-green/40 focus:ring-1 focus:ring-dev-green/20 transition-all"
                                    placeholder="your_email@domain.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-dev-text-sec mb-1.5" htmlFor="password">
                                devchat:~$ enter --password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-3.5 text-dev-green/50 font-mono text-sm">➜</span>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    id="password"
                                    required
                                    className="w-full pl-8 pr-4 py-3 bg-black/60 border border-emerald-950/40 rounded-lg text-dev-green font-mono placeholder-emerald-950 text-sm focus:border-dev-green/40 focus:ring-1 focus:ring-dev-green/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2 space-y-3">
                            <motion.button
                                whileHover={{ y: -1, filter: 'brightness(1.08)' }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                type="submit"
                                className="w-full py-3 bg-dev-green text-[#040705] font-black font-sans tracking-wide uppercase rounded-lg hover:shadow-[0_0_15px_rgba(44,230,125,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                            >
                                <span>Compile & Execute</span>
                                <ArrowRight size={16} />
                            </motion.button>

                            <div className="relative flex items-center justify-center my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-emerald-950/30"></div>
                                </div>
                                <span className="relative px-3 bg-[#08110C] text-[10px] font-mono text-dev-text-sec uppercase tracking-widest">
                                    OR AUTHORIZE WITH
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ y: -1, filter: 'brightness(1.08)' }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="w-full py-3 bg-transparent border border-emerald-950/60 text-dev-green hover:bg-dev-green/5 font-mono text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_8px_rgba(44,230,125,0.02)]"
                            >
                                <Shield size={14} />
                                <span>Sign In via SSO (Google)</span>
                            </motion.button>
                        </div>
                    </form>

                    <p className="text-xs text-dev-text-sec text-center mt-6 font-mono">
                        New entity? <Link to="/register" className="text-dev-green hover:text-dev-green-hover underline">register --new-session</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;