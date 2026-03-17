import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/user.context';

const FeatureCard = ({ title, desc, icon }) => {
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#091509] border border-green-900/30 overflow-hidden shadow-lg shadow-black/50"
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            rgba(34, 197, 94, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />
            <div className="z-10 mb-6 w-14 h-14 rounded-xl flex items-center justify-center bg-green-500/10 border border-green-500/20 text-green-400 group-hover:bg-green-500/20 transition-colors duration-300">
                {icon}
            </div>
            <div className="z-10">
                <h3 className="text-xl font-bold text-zinc-100 mb-3 group-hover:text-green-300 transition-colors duration-300">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
};

const Home = () => {
    const { user ,loading} = useContext(UserContext);
    if (loading)  return <div className='bg-black min-h-screen'>Loading...</div>
    return (
        <div className="min-h-screen bg-[#020502] text-zinc-100 selection:bg-green-500/30 font-sans">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-green-900/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-emerald-900/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
            </div>

            {/* Empty Navbar as requested */}
            <div className="relative z-10 container mx-auto px-6 h-20 flex items-center justify-between">
                <div></div>
                <div></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
                <div className="max-w-5xl mx-auto flex flex-col items-center">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-green-950/40 border border-green-900/50 backdrop-blur-md mb-8 hover:bg-green-900/40 transition-colors duration-300 cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                        </span>
                        <span className="text-xs font-semibold text-green-300 tracking-wider uppercase">Systems Online</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-8 text-zinc-100"
                    >
                        Write Code. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-300 via-emerald-400 to-green-700">
                            Together.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed"
                    >
                        Forget screen sharing. A fully real-time collaborative workspace with an integrated terminal, chat, and AI assistance built right in.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                    >
                        {user ? (
                            <Link to='/MyGD' className="group relative px-8 py-4 bg-green-500 text-black font-bold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3">
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                <span className="relative">Access Workspace</span>
                                <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                        ) : (
                            <Link to={'/Register'} className="group relative px-8 py-4 bg-green-500 text-black font-bold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all flex items-center justify-center gap-3">
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                <span className="relative">Initialize Session</span>
                                <svg className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </Link>
                        )}
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-transparent border border-green-900 text-zinc-300 font-semibold rounded-xl hover:bg-green-950/30 hover:text-green-300 hover:border-green-700 transition-all">
                            View Specs
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Unique Grid Features */}
            <section id="features" className="relative z-10 py-32 bg-[#010301] border-y border-green-950 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-20">
                        <motion.h2 scrollY={{}} className="text-4xl md:text-5xl font-black mb-6 text-zinc-100">
                            Core Architecture
                        </motion.h2>
                        <div className="w-20 h-1 bg-green-500 mb-6"> </div>
                        <p className="text-zinc-500 text-lg max-w-xl">
                            Engineered for high-performance team synchronization. Zero configuration out of the box.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard 
                            title="Instant Sync Protocol"
                            desc="Milisecond-accurate OT (Operational Transformation) ensures nobody overwrites each other's code. Real-time file trees and typing indicators."
                            icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        />
                        <FeatureCard 
                            title="Embedded AI Copilot"
                            desc="Ping @ai inside the chat room. It has full context of your codebase and can generate, refactor, or explain logic immediately."
                            icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
                        />
                        <FeatureCard 
                            title="WebContainers Local Runtime"
                            desc="Run a full Node.js environment directly in your browser. Install packages, run dev servers, test APIs without leaving the tab."
                            icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>}
                        />
                    </div>
                </div>
            </section>

            {/* Workflow Pipeline */}
            <section className="relative z-10 py-32 bg-[#020502]">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-10 text-zinc-100">
                            Execution Pipeline
                        </h2>
                        <div className="space-y-4">
                            {[
                                "Deploy a Room & Share Link",
                                "Peers Connect via WebSockets",
                                "Write Code & Discuss in UI",
                                "AI Scavenges Bugs on Demand",
                                "Live Server Previews on the fly"
                            ].map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                                    className="group flex gap-5 items-center p-5 rounded-xl hover:bg-[#091509] border border-transparent hover:border-green-900/50 transition-colors cursor-crosshair"
                                >
                                    <div className="w-10 h-10 rounded-full bg-green-950 flex flex-shrink-0 items-center justify-center font-bold text-green-400 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-black transition-all shadow-md shadow-transparent group-hover:shadow-green-500/20">
                                        0{idx + 1}
                                    </div>
                                    <h4 className="text-xl font-medium text-zinc-300 group-hover:text-green-300 transition-colors">
                                        {step}
                                    </h4>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="relative h-[400px] w-full bg-[#050c05] border border-green-900/40 rounded-2xl overflow-hidden shadow-2xl shadow-green-900/20 group">
                        <div className="absolute top-0 w-full h-8 bg-black border-b border-green-900/30 flex items-center px-4 gap-2">
                           <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-red-500/80 transition-colors"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-yellow-500/80 transition-colors"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500/80 transition-colors"></div>
                           <div className="ml-4 text-xs font-mono text-green-700 group-hover:text-green-500 transition-colors">terminal ~ user@devchat</div>
                        </div>
                        <div className="p-6 pt-12 font-mono text-sm leading-relaxed text-zinc-500">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ staggerChildren: 0.1 }}
                            >
                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex gap-2">
                                    <span className="text-green-500">➜</span>
                                    <span className="text-emerald-700">~</span>
                                    <span className="text-zinc-100">npm create space</span>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-zinc-400">
                                    Creating fully loaded workspace environment...
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-1 text-green-400">
                                    ✔ Dependencies installed
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-1 text-green-400">
                                    ✔ WebContainers initialized
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-4 flex gap-2">
                                    <span className="text-green-500">➜</span>
                                    <span className="text-emerald-700">workspace</span>
                                    <span className="text-zinc-100 flex items-center gap-1">npm run dev <span className="w-2 h-4 bg-green-400 animate-pulse inline-block"></span></span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Launch Banner */}
            <section className="relative z-10 py-32 bg-[#010301] border-t border-green-950 text-center px-6">
                <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-8 lowercase tracking-tighter hover:tracking-widest transition-all duration-700">
                    Ready to compile?
                </h2>
                
                {user ? (
                    <Link to={'/MyGD'} className="inline-flex bg-zinc-100 text-black hover:bg-green-400 font-bold px-10 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 duration-300">
                        Launch Dashboard
                    </Link>
                ) : (
                    <Link to={'/Register'} className="inline-flex bg-zinc-100 text-black hover:bg-green-400 font-bold px-10 py-5 rounded-xl transition-all hover:scale-105 active:scale-95 duration-300 shadow-[0_0_20px_rgba(34,197,94,0)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                        Create Account
                    </Link>
                )}
            </section>
        </div>
    );
};

export default Home;