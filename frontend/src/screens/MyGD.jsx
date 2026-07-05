import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/user.context';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../config/axios';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundGrid from '../components/BackgroundGrid';
import { 
  Folder, Plus, GitBranch, Play, Users, MessageSquare, Terminal, 
  Settings, LogOut, Cpu, AlertCircle, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

const MyGD = () => {
    const { user, setUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredProjectId, setHoveredProjectId] = useState(null);
    const navigate = useNavigate();

    function logoutHandler() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    }

    function createProject(e) {
        e.preventDefault();
        if (!projectName.trim()) return;
        setLoading(true);

        axios.post('/projects/create', {
            name: projectName,
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then((res) => {
            setProjects([...projects, res.data]);
            setProjectName('');
            setIsModalOpen(false);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }

    useEffect(() => {
        setLoading(true);
        if (user) {
            axios.get('/projects/all', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then((res) => {
                setProjects(res.data.projects || []);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
        }
    }, [user]);

    if (loading && projects.length === 0) {
        return (
            <div className="min-h-screen bg-dev-bg text-dev-text flex flex-col items-center justify-center font-mono">
                <BackgroundGrid />
                <div className="flex flex-col items-center gap-3 relative z-10">
                    <span className="w-8 h-8 rounded-full border-2 border-dev-green/20 border-t-dev-green animate-spin" />
                    <p className="text-xs text-dev-green animate-pulse">CONNECTING TO SECURE CLOUD REGISTRY...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-dev-bg text-dev-text px-6 md:px-12 pt-24 pb-12 font-sans relative">
            <BackgroundGrid />


            <div className="absolute top-[10%] left-[30%] w-[600px] h-[600px] bg-dev-green/5 rounded-full blur-[140px] pointer-events-none" />


            <header className="fixed top-0 left-0 w-full h-16 bg-dev-nav/80 backdrop-blur border-b border-emerald-950/40 z-30 flex items-center justify-between px-6 md:px-12">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-dev-green" />
                        <span className="font-mono text-sm font-bold uppercase tracking-wider text-dev-text">DEVCHAT</span>
                    </Link>
                    <span className="text-[10px] font-mono text-dev-text-sec px-2 py-0.5 bg-emerald-950/30 border border-emerald-950/60 rounded">
                        DASHBOARD
                    </span>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-dev-text-sec hidden sm:inline-block">➜ user: <span className="text-dev-green font-bold">{user?.email}</span></span>
                    <button 
                        onClick={logoutHandler}
                        className="btn-os flex items-center gap-1 px-3 py-1.5 bg-[#FF5D73]/10 text-dev-danger border border-[#FF5D73]/30 hover:bg-dev-danger hover:text-black rounded text-[10px] uppercase font-bold"
                    >
                        <LogOut size={11} />
                        <span>Disconnect</span>
                    </button>
                </div>
            </header>


            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase text-dev-text tracking-tight mb-1">
                            User Node Workspace
                        </h1>
                        <p className="text-xs font-mono text-dev-text-sec">
                            Active projects compiled on local client nodes.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ y: -1, filter: 'brightness(1.08)' }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        onClick={() => setIsModalOpen(true)}
                        className="btn-os inline-flex items-center gap-2 px-5 py-3 bg-dev-green text-dev-bg font-black font-sans uppercase tracking-wider text-xs rounded shadow-[0_0_15px_rgba(44,230,125,0.15)] hover:shadow-[0_0_25px_rgba(44,230,125,0.35)] cursor-pointer"
                    >
                        <Plus size={14} />
                        <span>Initialize Project</span>
                    </motion.button>
                </div>

                {projects.length === 0 ? (
                    <div className="border border-emerald-950/40 bg-dev-bg-sec/60 rounded-xl p-16 text-center max-w-xl mx-auto font-mono text-xs text-dev-text-sec">
                        <Folder className="mx-auto mb-4 text-dev-text-sec" size={40} />
                        <p className="mb-6">No workspaces registered in this environment. Run build session initialization.</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="btn-os px-4 py-2 border border-dev-green/30 text-dev-green hover:bg-dev-green/5 rounded text-[11px]"
                        >
                            Initialize devchat_project
                        </button>
                    </div>
                ) : (
                    <div className="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, idx) => {

                            const branches = ["main", "feature/auth", "develop", "hotfix/websocket", "patch-v1.2"];
                            const branchName = branches[idx % branches.length];
                            

                            const aiStatuses = ["idle", "processing", "synced"];
                            const aiStatus = aiStatuses[idx % aiStatuses.length];


                            const sparklines = [
                                "M0 15 Q 15 5, 30 25 T 60 10 T 90 20 T 120 15",
                                "M0 25 L 20 10 L 40 28 L 60 5 L 80 18 L 100 8 L 120 22",
                                "M0 18 C 30 2, 60 38, 90 10 C 105 18, 110 5, 120 12"
                            ];
                            const sparkPath = sparklines[idx % sparklines.length];

                            return (
                                <motion.div 
                                    key={project._id}
                                    layout
                                    onMouseEnter={() => setHoveredProjectId(project._id)}
                                    onMouseLeave={() => setHoveredProjectId(null)}
                                    onClick={() => navigate(`/project`, { state: { project } })}
                                    className="dev-card p-6 flex flex-col justify-between cursor-pointer group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-dev-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 rounded bg-[#0C160F] border border-emerald-950/60 flex items-center justify-center text-dev-green transition-transform group-hover:scale-105 group-hover:rotate-2 duration-300 shadow-[0_0_10px_rgba(44,230,125,0.02)]">
                                            <Folder size={18} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dev-green opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-dev-green"></span>
                                            </span>
                                            <span className="text-[10px] font-mono text-dev-green">ONLINE</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-black uppercase text-dev-text mb-3 flex items-center justify-between group-hover:text-dev-green transition-colors">
                                            <span className="truncate pr-4">{project.name}</span>
                                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-dev-green" />
                                        </h2>

                                        <div className="space-y-1.5 font-mono text-[10px] text-dev-text-sec border-t border-emerald-950/20 pt-3">
                                            <div className="flex items-center justify-between">
                                                <span>git:~$ branch</span>
                                                <span className="text-dev-blue flex items-center gap-1">
                                                    <GitBranch size={10} />
                                                    {branchName}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>ai:~$ engine</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                                                    aiStatus === "synced" ? "bg-dev-green/10 text-dev-green border border-dev-green/20" :
                                                    aiStatus === "processing" ? "bg-[#FFC857]/10 text-dev-warn border border-dev-warn/20" :
                                                    "bg-black/40 text-dev-text-sec border border-emerald-950/20"
                                                }`}>
                                                    {aiStatus}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>sys:~$ active</span>
                                                <span className="text-dev-text">2 hrs ago</span>
                                            </div>
                                        </div>
                                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-emerald-950/10">
                                            <svg className="w-full h-full" viewBox="0 0 120 30" fill="none">
                                                <path 
                                                    d={sparkPath} 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    strokeLinecap="round" 
                                                />
                                            </svg>
                                        </div>

                                        <div className="flex -space-x-1.5 overflow-hidden">
                                            {(project.users || []).slice(0, 3).map((usr, uIdx) => {
                                                const email = usr && typeof usr === 'object' ? usr.email : (typeof usr === 'string' ? usr : null);
                                                const displayInitial = email ? email[0].toUpperCase() : 'U';
                                                return (
                                                    <div 
                                                        key={usr._id || usr || uIdx} 
                                                        className="w-5 h-5 rounded-full border border-dev-bg bg-[#08110C] flex items-center justify-center text-[8px] font-mono text-[#A78BFA] font-bold shadow-md uppercase"
                                                        title={email || "Collaborator"}
                                                    >
                                                        {displayInitial}
                                                    </div>
                                                );
                                            })}
                                            {(project.users || []).length > 3 && (
                                                <div className="w-5 h-5 rounded-full border border-dev-bg bg-dev-bg-sec flex items-center justify-center text-[7px] font-mono text-dev-text-sec font-bold shadow-md">
                                                    +{project.users.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {hoveredProjectId === project._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.15 }}
                                                className="overflow-hidden font-mono text-[9px] text-[#8C9399] mt-3 border-t border-emerald-950/20 pt-2 space-y-1"
                                            >
                                                <div className="text-dev-green/70">[$] sarah@devchat: edited App.js (4m ago)</div>
                                                <div>[$] system: compiler cached dependencies (1h ago)</div>
                                                <div>[$] ai-agent: updated build configuration (2h ago)</div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            className="bg-[#08110C] border border-dev-green/30 rounded-xl shadow-2xl shadow-dev-green/5 w-11/12 max-w-md overflow-hidden"
                        >
                            <div className="w-full h-10 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-4">
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => setIsModalOpen(false)} className="w-2.5 h-2.5 rounded-full bg-[#FF5D73]/80 hover:bg-[#FF5D73] transition-colors cursor-pointer" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFC857]/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#37E88F]/80" />
                                </div>
                                <span className="text-[10px] font-mono text-dev-text-sec">sysctl --create-project</span>
                                <div className="w-10" />
                            </div>

                            <div className="p-6">
                                <h2 className="text-lg font-black uppercase text-dev-text mb-4 flex items-center gap-2">
                                    <span>Initialize New Node</span>
                                </h2>
                                <form onSubmit={createProject}>
                                    <div className="mb-6">
                                        <label className="block text-[10px] font-mono text-dev-text-sec mb-2">
                                            devchat:~$ name --project
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-dev-green font-mono">➜</span>
                                            <input
                                                onChange={(e) => setProjectName(e.target.value)}
                                                value={projectName}
                                                type="text" 
                                                required
                                                className="w-full pl-8 pr-4 py-2.5 bg-black/60 font-mono text-xs text-dev-green border border-emerald-950/40 rounded focus:border-dev-green/40 focus:ring-1 focus:ring-dev-green/20 transition-all placeholder-emerald-950" 
                                                placeholder="my-reactive-app"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3 font-mono text-[10px]">
                                        <button 
                                            type="button" 
                                            className="px-4 py-2 text-dev-text-sec hover:text-dev-text transition-colors cursor-pointer" 
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-os px-4 py-2 bg-dev-green text-dev-bg font-bold uppercase rounded cursor-pointer"
                                        >
                                            Execute
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default MyGD;
