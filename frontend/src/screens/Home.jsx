import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BackgroundGrid from '../components/BackgroundGrid';
import { auth } from '../config/firebase';
import axios from '../config/axios';
import { 
  Terminal, Play, Users, Cpu, Zap, GitBranch, ArrowRight, CheckCircle2, 
  MessageSquare, Layers, Code, Award, ChevronRight, Globe, Laptop, Star,
  UserPlus
} from 'lucide-react';

const Home = () => {
    const { user, setUser, setLoading } = useContext(UserContext);
    const navigate = useNavigate();
    
    // Typing DEVCHAT hero animation
    const [brandText, setBrandText] = useState("");
    useEffect(() => {
        const fullText = "DEVCHAT";
        let i = 0;
        const timer = setInterval(() => {
            if (i < fullText.length) {
                setBrandText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 120);
        return () => clearInterval(timer);
    }, []);

    // Streaming terminal logs in hero
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const sampleLogs = [
            "Initializing devchat core services...",
            "Loading local WebContainer compiler... [OK]",
            "Establishing tunnel at wss://sync.devchat.io/room_gate... [CONNECTED]",
            "Operational Transformation (OT) engine synced.",
            "DEVCHAT systems fully online.",
        ];
        let index = 0;
        const interval = setInterval(() => {
            if (index < sampleLogs.length) {
                setLogs(prev => [...prev, sampleLogs[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    // Scroll triggered commands execution
    const terminalRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: terminalRef,
        offset: ["start end", "end start"]
    });
    
    const [activeCmds, setActiveCmds] = useState([]);
    const scrollPercent = useTransform(scrollYProgress, [0.1, 0.8], [0, 100]);

    const cliSteps = [
        { id: 1, cmd: "npm install -g @devchat/cli", output: "added 1 package, and audited 2 packages in 850ms" },
        { id: 2, cmd: "devchat auth login", output: "✔ Successfully authenticated session as developer@devchat.io" },
        { id: 3, cmd: "devchat room create my-sandbox", output: "✔ Room my-sandbox initialized at room_id: dc_7392_alpha" },
        { id: 4, cmd: "devchat run dev --container", output: "✔ Mount filesystem... [OK]\n✔ Boot Node.js WebContainer runtime... (320ms)\n➜ Local server running at http://localhost:5173" },
        { id: 5, cmd: "devchat invite colla_collab", output: "✔ Sent WebSocket sync request\n✔ sarah@devchat.io connected to session\n✔ alex@devchat.io connected to session" },
    ];

    useEffect(() => {
        return scrollPercent.onChange((v) => {
            const stepIndex = Math.floor((v / 100) * cliSteps.length);
            const visibleSteps = cliSteps.slice(0, Math.min(stepIndex + 1, cliSteps.length));
            setActiveCmds(visibleSteps);
        });
    }, []);

    // Dynamic product demo state
    const [demoActiveTab, setDemoActiveTab] = useState("App.js");
    const [demoLogs, setDemoLogs] = useState(["$ npm run dev", "Vite v5.2.11 ready in 210ms", "  ➜  Local: http://localhost:5173/"]);
    const [demoChat, setDemoChat] = useState([
        { sender: "Sarah", text: "Hey! Let's refactor the API helper function." },
        { sender: "AI Agent", text: "I can optimize that file. I noticed that the fetch throttle limit is missing. Should I patch it?" },
        { sender: "Alex", text: "Yes please, apply the fix @ai." }
    ]);
    const [demoFiles] = useState(["package.json", "App.js", "api.js", "index.css"]);

    const handleLogout = async () => {
        try {
            setLoading(true);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            
            try {
                await auth.signOut();
            } catch (e) {
                console.log("Firebase signout error:", e);
            }

            await axios.get('/users/logout', {
                withCredentials: true
            });
            
            navigate('/login');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen bg-dev-bg text-dev-text font-sans overflow-x-hidden">
            <BackgroundGrid />

            {/* Global Ambient Glow */}
            <div className="absolute top-[-10%] left-[5%] w-[800px] h-[800px] bg-dev-green/5 rounded-full blur-[160px] pointer-events-none" />

            {/* Navigation */}
            <header className="relative z-20 border-b border-emerald-950/40 bg-dev-nav/80 backdrop-blur-md sticky top-0 h-16 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-dev-green animate-pulse shadow-[0_0_10px_#2CE67D]" />
                    <span className="font-mono text-sm font-bold uppercase tracking-wider text-dev-text">DEVCHAT</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 font-mono text-xs text-dev-text-sec">
                    <a href="#demo" className="hover:text-dev-green transition-colors">Workspace Demo</a>
                    <a href="#features" className="hover:text-dev-green transition-colors">System Specs</a>
                    <a href="#architecture" className="hover:text-dev-green transition-colors">Pipeline</a>
                    <a href="#metrics" className="hover:text-dev-green transition-colors">Benchmarking</a>
                </nav>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link 
                                to="/MyGD" 
                                className="btn-os inline-flex items-center gap-1.5 px-3 py-1.5 bg-dev-green text-dev-bg font-mono text-xs font-bold rounded border border-dev-green-hover/25"
                            >
                                <span>Dashboard</span>
                                <ArrowRight size={12} />
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="btn-os inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-[#FF5D73] border border-[#FF5D73]/30 hover:bg-[#FF5D73]/10 font-mono text-xs rounded cursor-pointer"
                            >
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/Login" 
                                className="btn-os inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-dev-green border border-dev-green/40 font-mono text-xs rounded hover:bg-dev-green/5"
                            >
                                <span>Login</span>
                            </Link>
                            <Link 
                                to="/Register" 
                                className="btn-os inline-flex items-center gap-1.5 px-3 py-1.5 bg-dev-green text-dev-bg font-mono text-xs font-bold rounded"
                            >
                                <span>Register</span>
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 flex flex-col items-center justify-center text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    
                    {/* Live System Indicator */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-dev-bg-sec border border-emerald-950/60 font-mono text-[10px] text-dev-green tracking-wider uppercase mb-8 cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dev-green opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-dev-green"></span>
                        </span>
                        <span>Terminal Link Active</span>
                    </motion.div>

                    {/* Brand Heading */}
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-dev-text font-sans uppercase">
                        {brandText}<span className="animate-pulse text-dev-green">_</span>
                    </h1>

                    {/* Core Subtitle */}
                    <p className="text-xl md:text-2xl font-black text-dev-green uppercase tracking-wide mb-6 font-sans">
                        Build. Ship. Collaborate.
                    </p>

                    <p className="text-sm md:text-base text-dev-text-sec max-w-xl mb-10 leading-relaxed font-mono">
                        The web operating system for software teams. Zero-latency collaborative editing, in-browser compilation runtimes, and contextual AI agent synthesis.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {user ? (
                            <Link 
                                to="/MyGD" 
                                className="btn-os px-8 py-3.5 bg-dev-green text-dev-bg font-black font-sans uppercase tracking-wider rounded shadow-[0_0_20px_rgba(44,230,125,0.2)] hover:shadow-[0_0_30px_rgba(44,230,125,0.4)] text-xs"
                            >
                                Enter Local Console
                            </Link>
                        ) : (
                            <Link 
                                to="/Register" 
                                className="btn-os px-8 py-3.5 bg-dev-green text-dev-bg font-black font-sans uppercase tracking-wider rounded shadow-[0_0_20px_rgba(44,230,125,0.2)] hover:shadow-[0_0_30px_rgba(44,230,125,0.4)] text-xs"
                            >
                                Register Workspace
                            </Link>
                        )}
                        <a 
                            href="#demo"
                            className="btn-os px-8 py-3.5 bg-[#0C160F] text-dev-text-sec border border-emerald-950 hover:text-dev-text hover:border-dev-green/30 rounded font-mono text-xs"
                        >
                            Inspect Architecture
                        </a>
                    </div>
                </div>

                {/* Stream of Terminal Boot Logs */}
                <div className="w-full max-w-lg mt-16 p-4 rounded bg-[#08110C]/80 border border-emerald-950/40 text-left font-mono text-[10px] text-dev-text-sec shadow-lg backdrop-blur h-36 overflow-y-auto">
                    <div className="flex items-center gap-1.5 border-b border-emerald-950/20 pb-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#FF5D73]/60" />
                        <div className="w-2 h-2 rounded-full bg-[#FFC857]/60" />
                        <div className="w-2 h-2 rounded-full bg-[#37E88F]/60" />
                        <span className="text-[9px] text-[#8C9399] ml-2">syslog@devchat: ~</span>
                    </div>
                    {logs.map((log, idx) => (
                        <div key={idx} className="mb-1">
                            <span className="text-dev-green/60">[$]</span> {log}
                        </div>
                    ))}
                    <div className="flex items-center gap-1">
                        <span className="text-dev-green/60">[$]</span>
                        <span className="w-1.5 h-3 bg-dev-green animate-pulse inline-block" />
                    </div>
                </div>
            </section>

            {/* Trusted Technologies */}
            <section className="relative z-10 py-12 border-y border-emerald-950/30 bg-[#08110C]/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <p className="text-[10px] font-mono text-[#8C9399] uppercase tracking-widest text-center mb-8">
                        ENGINEERED ON TOP OF STABLE TECHNOLOGY PROTOCOLS
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-6 items-center text-center font-mono text-xs text-dev-text-sec">
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">React 18</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">WebContainers</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">Node.js</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">TailwindCSS</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">Socket.IO</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">Firebase</div>
                        <div className="p-3 border border-emerald-950/20 rounded hover:text-dev-green hover:border-dev-green/15 transition-all">Gemini AI</div>
                    </div>
                </div>
            </section>

            {/* Interactive Scroll-Triggered Command Line Console */}
            <section id="terminal-scroll" ref={terminalRef} className="relative z-10 py-32 px-6 bg-dev-bg">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black uppercase text-dev-text tracking-tight mb-3">
                            Scroll to Boot Environment
                        </h2>
                        <p className="text-xs font-mono text-dev-text-sec">
                            Watch the pipeline construct live file structures and websockets automatically.
                        </p>
                    </div>

                    <div className="bg-[#08110C] border border-emerald-950/60 rounded-xl overflow-hidden shadow-2xl">
                        {/* OS Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-dev-nav/80 border-b border-emerald-950/40">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5D73]/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFC857]/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#37E88F]/70" />
                            </div>
                            <span className="text-[10px] font-mono text-dev-text-sec">cli-session@devchat: ~/workspace</span>
                            <div className="w-10" />
                        </div>

                        {/* Interactive CLI Console log output */}
                        <div className="p-6 font-mono text-xs min-h-[350px] leading-relaxed select-none">
                            {activeCmds.map((step) => (
                                <div key={step.id} className="mb-4">
                                    <div className="flex gap-2 items-center text-dev-green font-bold">
                                        <span>devchat:~$</span>
                                        <span className="text-dev-text font-normal">{step.cmd}</span>
                                    </div>
                                    <pre className="mt-1 text-dev-text-sec text-[11px] whitespace-pre-wrap pl-6 border-l border-emerald-950/40 bg-black/10 p-2 rounded">
                                        {step.output}
                                    </pre>
                                </div>
                            ))}
                            {activeCmds.length < cliSteps.length && (
                                <div className="flex items-center gap-2 text-dev-text-sec animate-pulse italic text-[11px] mt-4">
                                    <span>[Scroll down to compile next commands...]</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Mock Product Demo */}
            <section id="demo" className="relative z-10 py-32 border-t border-emerald-950/20 bg-[#08110C]/10 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center md:text-left md:flex justify-between items-end gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase text-dev-text mb-3">
                                Fully Integrated Workspace
                            </h2>
                            <p className="text-xs font-mono text-dev-text-sec max-w-xl">
                                An absolute engineering workspace right in your browser. Complete with active file hierarchy explorer, resizable code pane, collaboration console, and compiler terminals.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-2 justify-center">
                            <span className="px-3 py-1 rounded border border-dev-green/20 bg-dev-green/5 font-mono text-[10px] text-dev-green">VSCode Keybindings</span>
                            <span className="px-3 py-1 rounded border border-dev-blue/20 bg-dev-blue/5 font-mono text-[10px] text-dev-blue">Zustand Sync</span>
                        </div>
                    </div>

                    {/* Mock IDE Frame */}
                    <div className="bg-[#040705] border border-emerald-950/50 rounded-xl overflow-hidden shadow-2xl h-[500px] flex flex-col font-mono text-xs">
                        {/* IDE Header */}
                        <div className="h-10 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5D73]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFC857]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-[#37E88F]" />
                                <span className="text-[10px] text-dev-text-sec ml-4">devchat://room/sandbox-alpha</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[10px] text-dev-green font-bold bg-dev-green/5 border border-dev-green/20 px-2 py-0.5 rounded">
                                    <span className="w-1.5 h-1.5 rounded-full bg-dev-green animate-ping" />
                                    <span>RUNNING PORT: 5173</span>
                                </div>
                                <button className="btn-os bg-dev-green text-dev-bg px-3 py-1 rounded text-[10px] font-sans font-bold uppercase flex items-center gap-1">
                                    <Play size={10} /> Run
                                </button>
                            </div>
                        </div>

                        {/* IDE Workspace Panels */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* Explorer Panel */}
                            <div className="w-48 bg-[#08110C]/80 border-r border-emerald-950/30 p-3 hidden md:block">
                                <div className="text-[9px] uppercase tracking-wider text-[#8C9399] mb-3">WORKSPACE FILES</div>
                                <div className="space-y-2">
                                    {demoFiles.map(file => (
                                        <button 
                                            key={file} 
                                            onClick={() => setDemoActiveTab(file)}
                                            className={`flex items-center gap-2 w-full text-left p-1 rounded transition-colors ${demoActiveTab === file ? 'text-dev-green bg-dev-green/5 font-bold' : 'text-dev-text-sec hover:text-dev-text'}`}
                                        >
                                            <Code size={12} className={demoActiveTab === file ? 'text-dev-green' : 'text-dev-text-sec'} />
                                            <span>{file}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Code Editor Panel */}
                            <div className="flex-1 flex flex-col bg-black/40">
                                {/* Editor Tabs */}
                                <div className="h-8 bg-[#0C160F] border-b border-emerald-950/20 flex items-center px-2 gap-1">
                                    {demoFiles.map(file => (
                                        <button 
                                            key={file}
                                            onClick={() => setDemoActiveTab(file)}
                                            className={`h-full px-4 border-r border-emerald-950/20 flex items-center gap-2 text-[10px] transition-all ${demoActiveTab === file ? 'bg-[#040705] text-dev-green border-t-2 border-t-dev-green font-bold' : 'text-dev-text-sec bg-[#08110C]/50 hover:bg-[#08110C]'}`}
                                        >
                                            <span>{file}</span>
                                        </button>
                                    ))}
                                </div>
                                {/* Code Content */}
                                <div className="flex-1 p-4 overflow-auto text-dev-text font-mono leading-relaxed bg-black/10 select-none">
                                    {demoActiveTab === "App.js" && (
                                        <pre className="text-dev-blue">
                                            {`1: import React from 'react';\n2: \n3: export default function App() {\n4:   return (\n5:     <div className="bg-dev-bg p-8">\n6:       <h1 className="text-dev-green">Hello, sandbox!</h1>\n7:     </div>\n8:   );\n9: }`}
                                        </pre>
                                    )}
                                    {demoActiveTab === "package.json" && (
                                        <pre className="text-dev-purple">
                                            {`1: {\n2:   "name": "devchat-demo",\n3:   "dependencies": {\n4:     "react": "^18.3.1",\n5:     "vite": "^5.2.11"\n6:   }\n7: }`}
                                        </pre>
                                    )}
                                    {demoActiveTab !== "App.js" && demoActiveTab !== "package.json" && (
                                        <pre className="text-dev-text-sec">
                                            {`1: // Source file: ${demoActiveTab}\n2: // Click other files in explorer to navigate.\n3: // Fully responsive panel updates.`}
                                        </pre>
                                    )}
                                </div>
                            </div>

                            {/* Collaborator Chat Panel */}
                            <div className="w-64 bg-[#08110C] border-l border-emerald-950/30 flex flex-col justify-between">
                                <div className="p-3 border-b border-emerald-950/30 text-[9px] uppercase tracking-wider text-dev-text-sec flex items-center gap-2 justify-between">
                                    <span>Sync Chat</span>
                                    <span className="px-1.5 py-0.5 bg-[#2CE67D]/10 text-dev-green border border-dev-green/20 rounded-full text-[8px]">3 PEERS</span>
                                </div>
                                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                                    {demoChat.map((c, i) => (
                                        <div key={i} className="p-2 rounded bg-black/30 border border-emerald-950/20">
                                            <div className="text-[9px] text-[#A78BFA] font-bold mb-1 flex items-center justify-between">
                                                <span>{c.sender}</span>
                                                {c.sender === "AI Agent" && <span className="bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/20 px-1 rounded text-[7px] uppercase font-sans">AGENT</span>}
                                            </div>
                                            <p className="text-[10px] text-dev-text leading-normal">{c.text}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-emerald-950/20 bg-black/40">
                                    <input 
                                        type="text" 
                                        readOnly
                                        placeholder="Type @ai to analyze code..."
                                        className="w-full bg-[#08110C] border border-emerald-950/40 rounded p-1.5 text-[10px] text-dev-text-sec outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* IDE Terminal Footer */}
                        <div className="h-28 bg-[#0C160F] border-t border-emerald-950/40 p-3 flex flex-col font-mono">
                            <div className="text-[9px] uppercase text-[#8C9399] tracking-wider mb-1 flex items-center gap-2">
                                <Terminal size={10} /> Terminal (npm runner)
                            </div>
                            <div className="flex-1 overflow-auto text-dev-green font-mono text-[10px] space-y-1">
                                {demoLogs.map((l, i) => <div key={i}>{l}</div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Grid */}
            <section id="features" className="relative z-10 py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl font-black uppercase text-dev-text mb-4">
                            System Specifications
                        </h2>
                        <p className="text-xs font-mono text-dev-text-sec max-w-lg mx-auto">
                            Built around minimal, confindent, high-density protocols optimized for deep software delivery.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        
                        {/* Feature 1 */}
                        <div className="dev-card p-8 group">
                            <div className="w-12 h-12 rounded bg-dev-green/5 border border-dev-green/15 flex items-center justify-center text-dev-green mb-6 transition-transform group-hover:rotate-2">
                                <Zap size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-dev-text font-sans uppercase mb-3 group-hover:text-dev-green transition-colors">
                                Realtime Sync State
                            </h3>
                            <p className="text-xs text-dev-text-sec font-mono leading-relaxed">
                                Zero conflict collaborative document sync based on OT resolution. Instantly sync workspace files, selections, active tabs, and terminal pipelines across team members.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="dev-card p-8 group">
                            <div className="w-12 h-12 rounded bg-dev-green/5 border border-dev-green/15 flex items-center justify-center text-dev-green mb-6 transition-transform group-hover:rotate-2">
                                <Cpu size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-dev-text font-sans uppercase mb-3 group-hover:text-dev-green transition-colors">
                                Local WebContainers
                            </h3>
                            <p className="text-xs text-dev-text-sec font-mono leading-relaxed">
                                Execute full Node.js compilation sandboxes directly in the sandbox context. Boot dev servers, install packages, and serve preview interfaces with zero server hosting.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="dev-card p-8 group">
                            <div className="w-12 h-12 rounded bg-dev-green/5 border border-dev-green/15 flex items-center justify-center text-dev-green mb-6 transition-transform group-hover:rotate-2">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-dev-text font-sans uppercase mb-3 group-hover:text-dev-green transition-colors">
                                Agentic Co-pilot
                            </h3>
                            <p className="text-xs text-dev-text-sec font-mono leading-relaxed">
                                Seamless integration with state-of-the-art AI. Reference @ai in your conversation streams to let it read directories, update files, install dependencies, and format scripts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Architecture Node Visualization */}
            <section id="architecture" className="relative z-10 py-32 bg-[#08110C]/25 border-y border-emerald-950/20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-black uppercase text-dev-text mb-3">
                            Pipeline Architecture
                        </h2>
                        <p className="text-xs font-mono text-dev-text-sec">
                            Understanding data flow across synchronization, container, and compilation runtimes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 relative select-none">
                        
                        {/* Box 1 */}
                        <div className="p-6 bg-dev-bg-sec border border-emerald-950/40 rounded text-center relative">
                            <div className="text-[10px] font-mono text-dev-green mb-2">NODE 01</div>
                            <h4 className="font-bold text-dev-text font-sans uppercase mb-2">WebSocket Sync</h4>
                            <p className="text-[10px] text-dev-text-sec font-mono">Handles cursor tracking, chat logs, and operational transform patches.</p>
                            <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 text-dev-green font-mono">➔</div>
                        </div>

                        {/* Box 2 */}
                        <div className="p-6 bg-dev-bg-sec border border-emerald-950/40 rounded text-center relative">
                            <div className="text-[10px] font-mono text-dev-green mb-2">NODE 02</div>
                            <h4 className="font-bold text-dev-text font-sans uppercase mb-2">Virtual FS</h4>
                            <p className="text-[10px] text-dev-text-sec font-mono">Dynamic local-state mapping representing file-trees for immediate execution.</p>
                            <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 text-dev-green font-mono">➔</div>
                        </div>

                        {/* Box 3 */}
                        <div className="p-6 bg-dev-bg-sec border border-emerald-950/40 rounded text-center relative">
                            <div className="text-[10px] font-mono text-dev-green mb-2">NODE 03</div>
                            <h4 className="font-bold text-dev-text font-sans uppercase mb-2">WebContainer</h4>
                            <p className="text-[10px] text-dev-text-sec font-mono">In-browser virtualized runtime running standard npm and Node shell execution.</p>
                            <div className="hidden md:block absolute right-[-15px] top-1/2 -translate-y-1/2 text-dev-green font-mono">➔</div>
                        </div>

                        {/* Box 4 */}
                        <div className="p-6 bg-dev-bg-sec border border-emerald-950/40 rounded text-center relative">
                            <div className="text-[10px] font-mono text-dev-green mb-2">NODE 04</div>
                            <h4 className="font-bold text-dev-text font-sans uppercase mb-2">Gemini Copilot</h4>
                            <p className="text-[10px] text-dev-text-sec font-mono">Analyzes context state and updates virtual filesystem files on demand.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Metric Numbers */}
            <section id="metrics" className="relative z-10 py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-black uppercase text-dev-text mb-3">
                            Benchmarked Diagnostics
                        </h2>
                        <p className="text-xs font-mono text-[#8C9399]">
                            Optimized performance numbers demonstrating native OS level speeds.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded text-center">
                            <div className="text-4xl font-black text-dev-green mb-2">&lt; 15ms</div>
                            <div className="text-[10px] font-mono text-dev-text uppercase tracking-widest mb-1">WS SYNC LATENCY</div>
                            <div className="text-[10px] text-dev-text-sec font-mono">OT state merge round-trip delay</div>
                        </div>
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded text-center">
                            <div className="text-4xl font-black text-dev-green mb-2">320ms</div>
                            <div className="text-[10px] font-mono text-dev-text uppercase tracking-widest mb-1">CONTAINER BOOT</div>
                            <div className="text-[10px] text-dev-text-sec font-mono">WebContainer VM spin up time</div>
                        </div>
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded text-center">
                            <div className="text-4xl font-black text-dev-green mb-2">ZERO</div>
                            <div className="text-[10px] font-mono text-dev-text uppercase tracking-widest mb-1">GLOBAL RE-RENDERS</div>
                            <div className="text-[10px] text-dev-text-sec font-mono">Editor is fully memoized</div>
                        </div>
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded text-center">
                            <div className="text-4xl font-black text-dev-green mb-2">99.9%</div>
                            <div className="text-[10px] font-mono text-dev-text uppercase tracking-widest mb-1">WEBSOCKET UPTIME</div>
                            <div className="text-[10px] text-dev-text-sec font-mono">Geo-replicated clustering</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Testimonials */}
            <section id="testimonials" className="relative z-10 py-32 bg-[#08110C]/10 border-t border-emerald-950/20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl font-black uppercase text-dev-text mb-3">
                            Developer Feedback
                        </h2>
                        <p className="text-xs font-mono text-dev-text-sec">
                            Logs written by real-world operators executing on the platform.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 font-mono text-xs">
                        {/* Testimonial 1 */}
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded relative">
                            <div className="flex items-center gap-1 mb-4 text-dev-green">
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                            </div>
                            <p className="text-dev-text-sec mb-4 italic leading-relaxed">
                                "The speed of collaboration on DEVCHAT is insane. Running Node code directly in a browser WebContainer while writing code with terminal-nostalgia styling is amazing."
                            </p>
                            <div className="text-[10px] text-[#A78BFA]">
                                ➜ user@github:~# devchat --owner
                                <span className="block text-[#8C9399] mt-0.5">Staff Engineer, Vercel</span>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="border border-emerald-950/40 bg-dev-bg-sec p-6 rounded relative">
                            <div className="flex items-center gap-1 mb-4 text-dev-green">
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                                <Star size={12} fill="#2CE67D" />
                            </div>
                            <p className="text-dev-text-sec mb-4 italic leading-relaxed">
                                "Draggable layout, integrated Monaco and Shiki markup parsing, absolute zero re-render issues in workspace when chatting, Sonner toasts are perfectly placed."
                            </p>
                            <div className="text-[10px] text-[#A78BFA]">
                                ➜ dev_lead@warp:~# systemctl info
                                <span className="block text-[#8C9399] mt-0.5">Founding Engineer, Linear</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Launch Banner CTA */}
            <section className="relative z-10 py-32 bg-[#040705] text-center px-6">
                <h2 className="text-4xl md:text-7xl font-black text-dev-text uppercase tracking-tighter mb-8 max-w-3xl mx-auto">
                    Compile your next project session
                </h2>
                {user ? (
                    <Link 
                        to="/MyGD" 
                        className="btn-os inline-flex items-center gap-2 bg-dev-green text-dev-bg font-black font-sans uppercase tracking-wider px-10 py-5 rounded shadow-[0_0_20px_rgba(44,230,125,0.2)] hover:shadow-[0_0_40px_rgba(44,230,125,0.4)] text-xs"
                    >
                        <span>Initialize Dashboard</span>
                        <ArrowRight size={16} />
                    </Link>
                ) : (
                    <Link 
                        to="/Register" 
                        className="btn-os inline-flex items-center gap-2 bg-dev-green text-dev-bg font-black font-sans uppercase tracking-wider px-10 py-5 rounded shadow-[0_0_20px_rgba(44,230,125,0.2)] hover:shadow-[0_0_40px_rgba(44,230,125,0.4)] text-xs"
                    >
                        <span>Establish Account</span>
                        <UserPlus size={16} />
                    </Link>
                )}
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-emerald-950/20 py-12 px-6 md:px-12 bg-dev-nav/80 backdrop-blur">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-dev-green" />
                        <span className="font-mono text-sm font-bold uppercase text-dev-text">DEVCHAT</span>
                    </div>
                    <p className="text-[10px] font-mono text-dev-text-sec text-center md:text-right">
                        &copy; 2026 DEVCHAT INC. ALL PROTOCOLS SECURED. PRESET LOGICAL STACKS ONLINE.
                    </p>
                </div>
            </footer>
        </main>
    );
};

export default Home;