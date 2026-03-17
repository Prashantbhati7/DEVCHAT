import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import {useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer.js'



function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [ isSidePanelOpen, setIsSidePanelOpen ] = useState(false)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set()) // Initialized as Set
    const [ project, setProject ] = useState(location.state.project)
    const [ message, setMessage ] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [ users, setUsers ] = useState([])
    const [ messages, setMessages ] = useState([]) // New state variable for messages
    const [ fileTree, setFileTree ] = useState({})

    const [ currentFile, setCurrentFile ] = useState(null)
    const [ openFiles, setOpenFiles ] = useState([])

    const [ webContainer, setWebContainer ] = useState(null)
    const [ iframeUrl, setIframeUrl ] = useState(null)

    const [ runProcess, setRunProcess ] = useState(null)

    const handleUserClick = (id) => {             // user selection for adding in group 
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });


    }

 
    function addCollaborators() {             // adding the selected users into the room 

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        },{withCredentials:true}).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
            setProject(res.data.project)
            setSelectedUserId(new Set()) // clear selected users
        }).catch(err => {
            console.log(err)
        })

    }

    const send = () => {

        sendMessage('project-message', {      // to emit message 
            message,
            sender: user
        })
        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("")

    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-[#050c05] text-zinc-300 rounded-sm p-3 font-mono scrollbar-hide'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }
    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        },{withCredentials:true}).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {

        initializeSocket(project._id)

        if (!webContainer) {
            //console.log("container not started")
            getWebContainer().then(container => {
                console.log("container started",container);
                setWebContainer(container)
                //console.log("container started")
            })
        }


        receiveMessage('project-message', data => {

           // console.log(data)
            
            if (data.sender._id == 'ai') {


                const message = JSON.parse(data.message)

                console.log("ai response is ",message);

                webContainer?.mount(message.fileTree)
                console.log("mounted on container")
                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                    saveFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            } else {


                setMessages(prevMessages => [ ...prevMessages, data ]) // Update messages state
            }
        })

        axios.get('/users/all',{withCredentials:true}).then(res => {
            console.log("got all users : ",users);
            setUsers(res.data.users)

        }).catch(err => {

            console.log(err)

        })

    }, [])

    useEffect(() => {
        try{
        axios.get(`/projects/get-project/${location.state.project._id}`,{withCredentials:true}).then(res => {

            //console.log(res.data.project)
            
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })
        }catch(err){
            console.log(err)
            
        }
    }, [])

    
    // function saveFileTree(ft) {
    //     axios.put('/projects/update-file-tree', {
    //         projectId: project._id,
    //         fileTree: ft
    //     }).then(res => {
    //         console.log(res.data)
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // }


    // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex bg-[#020502] text-zinc-100 font-sans selection:bg-green-500/30'>
            {/* Left Panel - Chat */}
            <section className="left relative flex flex-col h-screen min-w-[24rem] max-w-sm bg-[#050c05] border-r border-green-900/40 shadow-xl shadow-black z-20">
                <header className='flex justify-between items-center p-3 px-4 w-full bg-[#020502] border-b border-green-900/40 absolute z-10 top-0 shadow-md'>
                    <button className='flex gap-2 items-center text-zinc-300 hover:text-green-400 transition-colors font-mono text-sm group' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-circle-line text-lg group-hover:rotate-90 transition-transform"></i>
                        <p>Add Collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-zinc-300 hover:text-green-400 transition-colors'>
                        <i className="ri-group-line text-lg"></i>
                    </button>
                </header>

                <div className="conversation-area pt-16 pb-16 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="message-box p-3 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => {
                            const isAi = msg.sender._id === 'ai';
                            const isMe = msg.sender._id === user._id.toString();
                            return (
                                <div key={index} className={`${isAi ? 'max-w-[85%]' : 'max-w-[75%]'} ${isMe ? 'ml-auto' : ''} message flex flex-col p-3 rounded-2xl w-fit
                                    ${isAi ? 'bg-transparent border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 
                                      isMe ? 'bg-green-900/20 text-green-50 border border-green-800/30 rounded-br-sm' : 
                                             'bg-[#091509] text-zinc-300 border border-green-900/20 rounded-bl-sm'}
                                `}>
                                    <small className={`text-xs font-mono mb-1 ${isAi ? 'text-green-500' : isMe ? 'text-green-300/70' : 'text-zinc-500'}`}>
                                        {msg.sender.email}
                                    </small>
                                    <div className='text-sm leading-relaxed'>
                                        {isAi ?
                                            WriteAiMessage(msg.message)
                                            : <p>{msg.message}</p>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="inputField w-full flex absolute bottom-0 bg-[#020502] border-t border-green-900/40 p-2">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && send()}
                            className='p-3 px-4 border-none outline-none flex-grow bg-[#050c05] rounded-l-xl text-green-500 font-mono placeholder-green-900/50 focus:ring-1 focus:ring-green-500/30 transition-shadow' 
                            type="text" 
                            placeholder='~ enter message' 
                        />
                        <button
                            onClick={send}
                            className='px-6 bg-green-500 text-black font-bold rounded-r-xl hover:bg-green-400 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]'>
                            <i className="ri-send-plane-fill text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Side Panel (Collaborators) */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-[#020502] border-l border-green-900/40 absolute transition-all duration-300 z-20 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-3 bg-[#050c05] border-b border-green-900/40'>
                        <h1 className='font-semibold text-lg text-zinc-100 font-mono'><span className="text-green-500">➜</span> Team</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 text-zinc-400 hover:text-green-500 transition-colors'>
                            <i className="ri-close-fill text-xl"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-1 p-2">
                        {project.users && project.users.map(u => (
                            <div key={u._id} className="user cursor-pointer hover:bg-green-900/20 p-3 rounded-xl flex gap-3 items-center transition-colors border border-transparent hover:border-green-900/30">
                                <div className='aspect-square rounded-full w-10 h-10 flex items-center justify-center text-green-500 bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]'>
                                    <i className="ri-user-smile-line text-lg"></i>
                                </div>
                                <h1 className='font-mono text-sm text-zinc-300'>{u.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Right Panel - Editor & Explorer */}
            <section className="right bg-[#010301] flex-grow h-full flex">
                <div className="explorer h-full max-w-64 min-w-48 bg-[#050c05] border-r border-green-900/40 flex flex-col">
                    <div className="p-3 border-b border-green-900/40 flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase tracking-widest">
                        <i className="ri-folder-open-line text-green-500"></i> Project Files
                    </div>
                    <div className="file-tree w-full overflow-auto py-2">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([ ...new Set([ ...openFiles, file ]) ])
                                    }}
                                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-green-900/20 w-full transition-colors text-left group">
                                    <i className="ri-file-code-line text-green-700 group-hover:text-green-400 transition-colors"></i>
                                    <p className='font-mono text-sm line-clamp-1 overflow-hidden text-zinc-400 group-hover:text-zinc-200'>
                                        {file}
                                    </p>
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div className="code-editor flex flex-col flex-grow h-full shrink relative">
                    <div className="top flex justify-between items-center w-full bg-[#020502] border-b border-green-900/40 h-12">
                        <div className="files flex h-full overflow-x-auto scrollbar-hide">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}
                                        className={`open-file cursor-pointer px-4 flex items-center w-fit gap-2 font-mono text-sm border-r border-green-900/40 transition-colors h-full
                                            ${currentFile === file ? 'bg-[#010301] text-green-400 border-t-2 border-t-green-500' : 'bg-[#050c05] text-zinc-500 hover:text-zinc-300 hover:bg-[#0a140a]'}`}>
                                        <i className="ri-file-code-line"></i>
                                        <p>{file}</p>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 px-3">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)
                                    console.log("mounted on container",webContainer)

                                    const installProcess = await webContainer.spawn("npm", [ "install" ])
                                    console.log("process initialized npm intall ",installProcess)

                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))
                                    const installExitCode = await installProcess.exit;
                                    if (installExitCode !== 0) {
                                    throw new Error("npm install failed");
                                    }

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer.spawn("npm", [ "start" ]);
                                    console.log("process initialized npm start ",tempRunProcess)

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })
                                }}
                                className='px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black font-bold font-mono text-sm rounded-md transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                            >
                                <i className="ri-play-fill"></i> Run
                            </button>
                        </div>
                    </div>

                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto bg-[#010301]">
                        {
                            fileTree[ currentFile ] ? (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-transparent p-4">
                                    <pre className="hljs h-full bg-transparent">
                                        <code
                                            className="hljs h-full outline-none font-mono text-sm bg-transparent !bg-none text-zinc-300"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [ currentFile ]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[ currentFile ].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                    </pre>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full text-zinc-600 font-mono text-sm opacity-50">
                                    <i className="ri-terminal-box-line text-6xl mb-4 text-zinc-700"></i>
                                    <p>Select a file to edit</p>
                                </div>
                            )
                        }
                    </div>
                </div>

                {iframeUrl && webContainer &&
                    (<div className="flex min-w-96 flex-col h-full bg-[#050c05] border-l border-green-900/40 relative z-10 shadow-2xl">
                        <div className="address-bar flex items-center bg-[#020502] border-b border-green-900/40 p-2 gap-2">
                            <i className="ri-link text-green-700 ml-2"></i>
                            <input type="text"
                                onChange={(e) => setIframeUrl(e.target.value)}
                                value={iframeUrl} 
                                className="w-full p-1.5 px-3 bg-[#050c05] text-green-400 font-mono text-sm border border-green-900/30 rounded focus:outline-none focus:border-green-500/50" />
                            <button onClick={() => setIframeUrl(null)} className="p-1 px-2 text-zinc-500 hover:text-red-400 transition-colors">
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        {console.log("iframe url is ",iframeUrl)}
                        <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
                    </div>)
                }
            </section>

            {/* Add Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#050c05] border border-green-900/40 rounded-2xl shadow-2xl shadow-green-900/20 w-full max-w-md overflow-hidden group">
                        <div className="w-full h-8 bg-black border-b border-green-900/30 flex items-center px-4 gap-2">
                           <button onClick={() => setIsModalOpen(false)} className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-red-500/80 transition-colors cursor-pointer"></button>
                           <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                           <div className="ml-4 text-xs font-mono text-green-700">terminal ~ add-collaborator</div>
                        </div>
                        
                        <div className="p-6">
                            <h2 className='text-xl font-mono text-zinc-100 mb-6 flex items-center gap-2'>
                                <span className="text-green-500">➜</span> select_users
                            </h2>
                            <div className="users-list flex flex-col gap-2 mb-8 max-h-64 overflow-auto scrollbar-hide border border-green-900/30 rounded-xl p-2 bg-[#020502]">
                                {users.length === 0 ? <p className="text-zinc-500 font-mono text-sm p-4 text-center">No users found.</p> : null}
                                {users.map(u => (
                                    <div 
                                        key={u._id} 
                                        className={`user cursor-pointer rounded-lg p-3 flex gap-3 items-center transition-all border
                                            ${Array.from(selectedUserId).includes(u._id) 
                                                ? 'bg-green-900/40 border-green-500/50 text-green-400' 
                                                : 'border-transparent text-zinc-300 hover:bg-green-900/20 hover:border-green-900/30'}`} 
                                        onClick={() => handleUserClick(u._id)}
                                    >
                                        <div className={`aspect-square rounded-full w-10 h-10 flex items-center justify-center shadow-sm
                                            ${Array.from(selectedUserId).includes(u._id) 
                                                ? 'bg-green-500 text-black shadow-green-500/50' 
                                                : 'bg-[#050c05] text-green-700/50 border border-green-900/50'}`}>
                                            <i className="ri-user-add-line text-lg"></i>
                                        </div>
                                        <h1 className='font-mono text-sm flex-1'>{u.email}</h1>
                                        {Array.from(selectedUserId).includes(u._id) && (
                                            <i className="ri-checkbox-circle-fill text-xl text-green-500"></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 font-mono">
                                <button 
                                    className='px-5 py-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer'
                                    onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button
                                    onClick={addCollaborators}
                                    disabled={selectedUserId.size === 0}
                                    className={`px-5 py-2.5 rounded-lg transition-all font-bold flex items-center gap-2
                                        ${selectedUserId.size > 0 
                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-black shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer' 
                                            : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}>
                                    <i className="ri-share-forward-line"></i> Execute
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project