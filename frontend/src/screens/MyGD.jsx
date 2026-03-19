import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axios'

const MyGD = () => {
    const { user } = useContext(UserContext)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ projectName, setProjectName ] = useState(null)
    const [ project, setProject ] = useState([])
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate()

    function createProject(e) {
        setLoading(true);
        e.preventDefault()
        console.log({ projectName })

        axios.post('/projects/create', {
            name: projectName,
        },{withCredentials:true,headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }})
            .then((res) => {
                console.log(res)
                setProject([...project, res.data])
                setProjectName(null)
                setIsModalOpen(false)
                setLoading(false);
            })
            .catch((error) => {
                console.log(error)
                setLoading(false);
            })
    }

    useEffect(() => {
        setLoading(true);
        if (user) {axios.get('/projects/all',{withCredentials:true,headers:{
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }}).then((res) => {
           console.log("all projects are ",res.data.projects);
            setProject(res.data.projects)
            setLoading(false);
        }).catch(err => {
            console.log(err)
            setLoading(false);
        })
        }
    }, [user])
    if(loading) return <div className='min-h-screen flex items-center text-2xl justify-center'> Loading... </div>;
  return (
        <main className='min-h-screen pt-24 pb-12 bg-[#020502] text-zinc-100 flex-1 px-6 font-sans relative'>
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 left-1/4 w-[50rem] h-[50rem] bg-green-900/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-300 via-emerald-400 to-green-700">
                        Workspace Projects
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative px-6 py-3 bg-green-500 text-black font-bold rounded-xl overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative">Initialize Project</span>
                        <i className="ri-add-line font-bold text-xl relative group-hover:rotate-90 transition-transform"></i>
                    </button>
                </div>
                
                <div className="projects grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {
                    project.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#091509] border border-green-900/40 hover:border-green-500/50 overflow-hidden shadow-lg shadow-black/50 cursor-pointer hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-start justify-between mb-6">
                                <div className="z-10 w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/10 border border-green-500/20 text-green-400 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                                    <i className="ri-folder-open-line text-2xl"></i>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-950/40 border border-green-900/50 text-xs font-mono text-green-400">
                                    Active
                                </div>
                            </div>
                            
                            <div className="z-10">
                                <h2 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-green-300 transition-colors duration-300 line-clamp-1">
                                    {project.name}
                                </h2>

                                <div className="flex items-center gap-2 mt-4 text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                    <i className="ri-group-line text-green-600"></i>
                                    <p>Collaborators: <span className="text-zinc-300 font-mono ml-1">{project.users.length}</span></p>
                                </div>
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#050c05] border border-green-900/40 rounded-2xl shadow-2xl shadow-green-900/20 w-11/12 max-w-md overflow-hidden group">
                        <div className="w-full h-8 bg-black border-b border-green-900/30 flex items-center px-4 gap-2">
                           <button onClick={() => setIsModalOpen(false)} className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-red-500/80 transition-colors cursor-pointer"></button>
                           <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                           <div className="ml-4 text-xs font-mono text-green-700">terminal ~ create-project</div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-mono text-zinc-100 mb-6 flex items-center gap-2">
                                <span className="text-green-500">➜</span> new_project
                            </h2>
                            <form onSubmit={createProject}>
                                <div className="mb-6">
                                    <label className="block text-sm font-mono text-zinc-400 mb-2">~ project_name</label>
                                    <input
                                        onChange={(e) => setProjectName(e.target.value)}
                                        value={projectName || ''}
                                        type="text" 
                                        className="w-full p-3 font-mono bg-black text-green-500 border border-green-900/50 rounded-lg focus:outline-none focus:border-green-500/50 placeholder:text-green-900/50" 
                                        placeholder="Enter project name..."
                                        required 
                                    />
                                </div>
                                <div className="flex justify-end gap-3 font-mono">
                                    <button 
                                        type="button" 
                                        className="px-5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer" 
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-5 py-2.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-black rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer font-bold"
                                    >
                                        Execute
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
  )
}

export default MyGD
