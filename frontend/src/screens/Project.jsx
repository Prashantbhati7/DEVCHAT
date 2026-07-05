import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../context/user.context';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket';
import { useWorkspaceStore } from '../store/workspace';
import Editor from '@monaco-editor/react';
import { Terminal as XTermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getWebContainer, webContainerInstance } from '../config/webContainer.js';
import { 
  FolderOpen, Code, MessageSquare, Play, Plus, Users, Terminal as TerminalIcon, 
  Settings, ArrowLeft, Loader2, Copy, Check, X, Shield, GitBranch, Cpu, Search
} from 'lucide-react';
import 'xterm/css/xterm.css';

const CodeBlock = React.memo(({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code block copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="relative border border-emerald-950/40 rounded-lg overflow-hidden bg-black/80 my-3 font-mono text-xs shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-dev-nav border-b border-emerald-950/40 text-[10px] text-dev-text-sec">
        <span className="text-dev-blue font-bold">{language ? language.toUpperCase() : 'CODE'}</span>
        <button 
          onClick={handleCopy}
          className="hover:text-dev-green transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          {copied ? (
            <span className="text-dev-green flex items-center gap-1"><Check size={10} /> COPIED</span>
          ) : (
            <span className="flex items-center gap-1"><Copy size={10} /> COPY</span>
          )}
        </button>
      </div>
      <div className="p-3 overflow-auto flex max-h-72">
        {/* Line numbers */}
        <div className="text-right text-emerald-900 select-none pr-3 border-r border-emerald-950/20 space-y-1">
          {lines.map((_, idx) => (
            <div key={idx} className="h-4">{idx + 1}</div>
          ))}
        </div>
        {/* Code body */}
        <pre className="pl-3 text-dev-text space-y-1 overflow-x-auto flex-1 font-mono">
          {lines.map((line, idx) => (
            <code key={idx} className="block h-4 hover:bg-dev-green/5 transition-colors">{line || " "}</code>
          ))}
        </pre>
      </div>
    </div>
  );
});

const ChatBubble = React.memo(({ msg, currentUser }) => {
  const isAi = msg.sender._id === 'ai';
  const isMe = msg.sender._id === currentUser?._id?.toString();

  const StreamAiMessage = ({ content }) => {
    const [text, setText] = useState("");
    
    useEffect(() => {
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        parsed = { text: content };
      }
      
      const words = (parsed.text || "").split(" ");
      let index = 0;
      
      const timer = setInterval(() => {
        if (index < words.length) {
          setText(prev => prev + (prev ? " " : "") + words[index]);
          index++;
        } else {
          clearInterval(timer);
        }
      }, 35);
      
      return () => clearInterval(timer);
    }, [content]);

    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeContent = String(children).replace(/\n$/, '');
            return !inline && match ? (
              <CodeBlock code={codeContent} language={match[1]} />
            ) : (
              <code className="px-1.5 py-0.5 bg-black/40 text-dev-purple rounded font-mono text-[11px]" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'items-start'} mb-3`}>
      <span className={`text-[9px] font-mono mb-1 ${isAi ? 'text-dev-green' : isMe ? 'text-dev-blue' : 'text-dev-text-sec'}`}>
        {isAi ? 'AI agent' : (msg.sender?.email || msg.sender?.name || (typeof msg.sender === 'string' ? msg.sender : 'User'))}
      </span>
      <div className={`p-3 rounded-lg border text-xs leading-relaxed font-mono ${
        isAi ? 'bg-transparent border-dev-green/20 text-dev-text shadow-[0_0_10px_rgba(44,230,125,0.02)]' :
        isMe ? 'bg-dev-green/10 border-dev-green/30 text-dev-text' :
               'bg-dev-bg-sec border-emerald-950/40 text-dev-text-sec'
      }`}>
        {isAi ? (
          <StreamAiMessage content={msg.message} />
        ) : (
          <p className="whitespace-pre-wrap">{msg.message}</p>
        )}
      </div>
    </div>
  );
});

// Memoized File Explorer Node representation
const FileTreeNode = React.memo(({ filename, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(filename)}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left font-mono text-xs border-r-2 transition-colors ${
        isActive 
          ? 'bg-dev-green/5 text-dev-green border-dev-green font-bold' 
          : 'text-dev-text-sec border-transparent hover:bg-dev-bg-sec hover:text-dev-text'
      }`}
    >
      <Code size={13} className={isActive ? 'text-dev-green' : 'text-dev-text-sec'} />
      <span className="truncate">{filename}</span>
    </button>
  );
});

// Memoized Toolbar components
const Toolbar = React.memo(({ projectName, onRunClick, onInstallClick, isRunning }) => {
  return (
    <div className="h-12 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-4 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-dev-text uppercase tracking-wider">{projectName}</span>
        <div className="flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded bg-dev-bg border border-emerald-950/40 text-dev-blue">
          <GitBranch size={10} />
          <span>main</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onInstallClick}
          className="btn-os px-3 py-1.5 bg-transparent border border-emerald-950/60 text-dev-text-sec hover:text-dev-text hover:border-dev-green/20 rounded font-mono text-[10px] flex items-center gap-1 cursor-pointer"
        >
          <Cpu size={12} />
          <span>npm install</span>
        </button>

        <button
          onClick={onRunClick}
          disabled={isRunning}
          className="btn-os px-4 py-1.5 bg-dev-green text-dev-bg hover:bg-dev-green-hover hover:shadow-[0_0_15px_rgba(44,230,125,0.3)] transition-all font-sans font-black uppercase text-[10px] rounded flex items-center gap-1 cursor-pointer disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={12} fill="currentColor" />
              <span>Run Stack</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
});

// ==========================================
// 2. MAIN COMPONENT
// ==========================================

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect guard
  if (!location.state?.project) {
    useEffect(() => {
      navigate('/MyGD', { replace: true });
    }, []);
    return null;
  }

  const { user, setLoading } = useContext(UserContext);
  const [project, setProject] = useState(location.state.project);
  
  // States
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [fileTree, setFileTree] = useState(project.fileTree || {});
  const [iframeUrl, setIframeUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');

  // Zustand Store selectors
  const {
    selectedFile,
    openFiles,
    addOpenFile,
    closeOpenFile,
    setSelectedFile,
    setOpenFiles,
    isTerminalBooted,
    setTerminalBooted
  } = useWorkspaceStore();

  // WebContainer & Terminal Refs
  const [webContainer, setWebContainer] = useState(webContainerInstance);
  const webContainerRef = useRef(webContainerInstance);
  const [runProcess, setRunProcess] = useState(null);
  const messageBoxRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const termInstanceRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Command palette keyboard trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync / Socket Initializations
  useEffect(() => {
    setLoading(true);
    initializeSocket(project._id);

    // Mount WebContainer compiler
    if (!webContainerRef.current) {
      getWebContainer().then(container => {
        setWebContainer(container);
        webContainerRef.current = container;
        toast.success("Local WebContainer runtime loaded");
      }).catch(err => {
        console.error("WebContainer failed:", err);
        toast.error("WebContainer boot failure");
      });
    }

    // Connect message streams
    receiveMessage('project-message', data => {
      if (data.sender._id === 'ai') {
        let parsed;
        try {
          parsed = JSON.parse(data.message);
        } catch (e) {
          parsed = { text: data.message };
        }
        
        if (parsed.fileTree) {
          setFileTree(parsed.fileTree);
          saveFileTree(parsed.fileTree);
          safeMount(parsed.fileTree);
          toast.success("AI updated filesystem");
        }
        setMessages(prev => [...prev, data]);
      } else {
        setMessages(prev => [...prev, data]);
      }
    });

    // Load available node invitees
    axios.get('/users/all', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setUsers(res.data.users || []);
    }).catch(err => {
      console.error(err);
    });

    setLoading(false);
  }, []);

  // Boot terminal compiler outputs
  useEffect(() => {
    if (!terminalContainerRef.current) return;

    const term = new XTermTerminal({
      theme: {
        background: '#040705',
        foreground: '#2CE67D',
        cursor: '#2CE67D',
        selectionBackground: 'rgba(44, 230, 125, 0.2)',
        black: '#040705',
        red: '#FF5D73',
        green: '#37E88F',
        yellow: '#FFC857',
        blue: '#80BFFF',
        magenta: '#A78BFA',
        cyan: '#80BFFF',
        white: '#F4F4F4',
      },
      fontFamily: 'Geist Mono',
      fontSize: 11,
      lineHeight: 1.4,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalContainerRef.current);
    fitAddon.fit();

    termInstanceRef.current = term;

    term.writeln("\x1b[32m➜  DEVCHAT OS Virtual Compiler Terminal v1.0.0 booted.\x1b[0m");
    term.writeln("Awaiting build pipeline deployment...");

    return () => {
      term.dispose();
    };
  }, []);

  const safeMount = async (tree) => {
    const container = webContainerRef.current || webContainer;
    if (!container) {
      console.warn("WebContainer is not initialized yet");
      return;
    }
    try {
      const cleanTree = JSON.parse(JSON.stringify(tree));
      await container.mount(cleanTree);
    } catch (error) {
      console.error("WebContainer mount failed:", error);
      toast.error("WebContainer filesystem mount failed");
    }
  };

  // Update backend file-tree save function
  const saveFileTree = (ft) => {
    axios.put('/projects/update-file-tree', {
      projectId: project._id,
      fileTree: ft
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      console.log("Filetree saved");
    }).catch(err => {
      console.error("Save filetree error:", err);
    });
  };

  // Editor content handler
  const handleEditorChange = (value) => {
    if (!selectedFile) return;
    
    const ft = {
      ...fileTree,
      [selectedFile]: {
        file: {
          contents: value
        }
      }
    };
    setFileTree(ft);

    // Debounce database sync (600ms)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveFileTree(ft);
    }, 600);
  };

  const handleCompileInstall = async () => {
    if (!(webContainerRef.current || webContainer)) {
      toast.error("WebContainer environment not online");
      return;
    }

    toast.info("Running npm installation on virtual compiler...");
    termInstanceRef.current?.writeln("\r\n\x1b[33m➜  Running: npm install\x1b[0m");

    await safeMount(fileTree);
    const installProcess = await (webContainerRef.current || webContainer).spawn("npm", ["install"]);
    
    installProcess.output.pipeTo(new WritableStream({
      write(chunk) {
        termInstanceRef.current?.write(chunk);
      }
    }));

    const installExitCode = await installProcess.exit;
    if (installExitCode !== 0) {
      termInstanceRef.current?.writeln("\r\n\x1b[31m✖ NPM Install failed.\x1b[0m");
      toast.error("Installation failed on virtual node");
      return;
    }
    
    termInstanceRef.current?.writeln("\r\n\x1b[32m✔ Installation completed successfully.\x1b[0m");
    toast.success("Packages configured!");
  };

  const handleCompileRun = async () => {
    if (!(webContainerRef.current || webContainer)) {
      toast.error("WebContainer environment not online");
      return;
    }

    setIsRunning(true);
    termInstanceRef.current?.writeln("\r\n\x1b[33m➜  Starting web application daemon: npm start\x1b[0m");

    await safeMount(fileTree);

    if (runProcess) {
      runProcess.kill();
    }

    const tempRunProcess = await (webContainerRef.current || webContainer).spawn("npm", ["start"]);
    tempRunProcess.output.pipeTo(new WritableStream({
      write(chunk) {
        termInstanceRef.current?.write(chunk);
      }
    }));

    setRunProcess(tempRunProcess);

    webContainer.on('server-ready', (port, url) => {
      setIframeUrl(url);
      setIsRunning(false);
      toast.success(`Server live at localhost:${port}`);
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessage('project-message', {
      message,
      sender: user
    });
    setMessages(prev => [...prev, { sender: user, message }]);
    setMessage('');
  };

  const handleInviteUserClick = (id) => {
    setSelectedUserId(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
      }
      return copy;
    });
  };

  const executeAddCollaborators = () => {
    setLoading(true);
    axios.put("/projects/add-user", {
      projectId: project._id,
      users: Array.from(selectedUserId)
    }, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setIsModalOpen(false);
      setProject(res.data.project);
      setSelectedUserId(new Set());
      toast.success("Collaborators invited successfully");
    }).catch(err => {
      console.error(err);
      toast.error("Failed to add collaborators");
    }).finally(() => {
      setLoading(false);
    });
  };

  const getEditorLanguage = (filename) => {
    if (!filename) return "javascript";
    const ext = filename.split('.').pop();
    if (ext === "js" || ext === "jsx") return "javascript";
    if (ext === "ts" || ext === "tsx") return "typescript";
    if (ext === "json") return "json";
    if (ext === "html") return "html";
    if (ext === "css") return "css";
    if (ext === "md") return "markdown";
    return "plaintext";
  };

  const filteredFiles = Object.keys(fileTree).filter(f => 
    f.toLowerCase().includes(paletteSearch.toLowerCase())
  );

  return (
    <main className="h-screen w-screen flex bg-dev-bg text-dev-text font-sans overflow-hidden select-none">
      <Toaster position="bottom-right" theme="dark" />

      <PanelGroup direction="horizontal" className="flex-grow">

        <Panel defaultSize={22} minSize={15} className="bg-dev-bg-sec border-r border-emerald-950/40 flex flex-col justify-between">
          
          <div className="h-12 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-3">
            <button 
              onClick={() => navigate('/MyGD')}
              className="text-dev-text-sec hover:text-dev-text flex items-center gap-1 font-mono text-[10px]"
            >
              <ArrowLeft size={12} />
              <span>DASHBOARD</span>
            </button>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-os px-2 py-1 bg-dev-green/10 border border-dev-green/20 hover:bg-dev-green hover:text-dev-bg text-dev-green font-mono text-[9px] uppercase font-bold rounded flex items-center gap-1"
            >
              <Plus size={10} />
              <span>COLLAB</span>
            </button>
          </div>

          <div className="px-3 py-1.5 border-b border-emerald-950/20 bg-dev-bg-sec flex items-center gap-2 overflow-x-auto">
            <span className="text-[9px] font-mono text-dev-text-sec uppercase tracking-wider">TEAM:</span>
            <div className="flex gap-1.5 overflow-x-auto py-0.5">
              {(project.users || []).map((u, uIdx) => {
                const email = u && typeof u === 'object' ? u.email : (typeof u === 'string' ? u : null);
                const displayInitial = email ? email[0].toUpperCase() : 'U';
                return (
                  <div 
                    key={u._id || u || uIdx} 
                    className="w-4 h-4 rounded-full bg-dev-green/10 border border-dev-green/20 flex items-center justify-center text-[7.5px] font-mono text-dev-green font-bold uppercase shadow-sm flex-shrink-0"
                    title={email || "Collaborator Node"}
                  >
                    {displayInitial}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div 
              ref={messageBoxRef}
              className="flex-grow p-4 overflow-y-auto space-y-3 scrollbar-thin"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-dev-text-sec font-mono text-[10px] opacity-40 p-4">
                  <MessageSquare size={20} className="mb-2" />
                  <p>Secure link open. Mention @ai in streams to configure scripts.</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <ChatBubble key={index} msg={msg} currentUser={user} />
              ))}
            </div>

            <div className="p-3 border-t border-emerald-950/40 bg-dev-nav/45 flex items-center gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message or type @ai..."
                className="flex-grow bg-black/60 border border-emerald-950/30 rounded p-2 text-xs font-mono text-dev-green placeholder-emerald-950/70"
              />
              <button
                onClick={handleSendMessage}
                className="btn-os p-2 bg-dev-green text-dev-bg hover:bg-dev-green-hover rounded font-bold"
              >
                <Play size={12} fill="currentColor" />
              </button>
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-emerald-950/40 hover:bg-dev-green/30 transition-colors cursor-col-resize" />

        <Panel defaultSize={15} minSize={10} className="bg-dev-bg-sec border-r border-emerald-950/40 flex flex-col">
          <div className="h-12 bg-dev-nav border-b border-emerald-950/40 flex items-center px-4 gap-2 text-dev-text-sec font-mono text-[10px] uppercase tracking-wider">
            <FolderOpen size={12} className="text-dev-green" />
            <span>Files Explorer</span>
          </div>

          <div className="flex-grow overflow-y-auto py-2">
            {Object.keys(fileTree).length === 0 && (
              <p className="text-[10px] text-dev-text-sec font-mono p-4">No workspace files synced.</p>
            )}
            {Object.keys(fileTree).map((filename, idx) => (
              <FileTreeNode 
                key={idx}
                filename={filename}
                isActive={selectedFile === filename}
                onClick={addOpenFile}
              />
            ))}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-emerald-950/40 hover:bg-dev-green/30 transition-colors cursor-col-resize" />

        <Panel defaultSize={48} className="flex flex-col">
          
          <Toolbar 
            projectName={project.name}
            onInstallClick={handleCompileInstall}
            onRunClick={handleCompileRun}
            isRunning={isRunning}
          />

          <div className="h-8 bg-dev-nav border-b border-emerald-950/20 flex items-center px-2 gap-1 overflow-x-auto">
            {openFiles.map((file, idx) => (
              <div 
                key={idx}
                className={`h-full px-3.5 flex items-center gap-2 font-mono text-[11px] border-r border-emerald-950/20 transition-all ${
                  selectedFile === file 
                    ? 'bg-[#040705] text-dev-green border-t-2 border-t-dev-green font-bold shadow-[0_-2px_8px_rgba(44,230,125,0.05)]' 
                    : 'bg-[#08110C]/50 text-dev-text-sec hover:text-dev-text hover:bg-[#08110C]'
                }`}
              >
                <button onClick={() => setSelectedFile(file)} className="cursor-pointer">{file}</button>
                <button 
                  onClick={() => closeOpenFile(file)}
                  className="hover:text-dev-danger transition-colors text-[9px]"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
            <PanelGroup direction="vertical">
              
              <Panel defaultSize={75} className="flex flex-col">
                {selectedFile && fileTree[selectedFile] ? (
                  <div className="flex-grow w-full relative">
                    <Editor
                      height="100%"
                      theme="vs-dark"
                      path={selectedFile}
                      language={getEditorLanguage(selectedFile)}
                      value={fileTree[selectedFile].file.contents || ""}
                      onChange={handleEditorChange}
                      options={{
                        fontFamily: 'Geist Mono',
                        fontSize: 12.5,
                        minimap: { enabled: false },
                        lineHeight: 18.5,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                        padding: { top: 12 },
                        renderLineHighlight: "all",
                        scrollbar: {
                          vertical: 'visible',
                          horizontal: 'visible',
                          verticalScrollbarSize: 6,
                          horizontalScrollbarSize: 6
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-dev-text-sec font-mono text-[11px] opacity-45">
                    <TerminalIcon size={40} className="mb-3 text-emerald-900" />
                    <p>Select a file from explorer to edit</p>
                    <p className="text-[10px] text-dev-green/50 mt-1">Press Ctrl+K / Cmd+K to navigate</p>
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="h-1 bg-emerald-950/40 hover:bg-dev-green/30 transition-colors cursor-row-resize" />

              <Panel defaultSize={25} minSize={15} className="bg-dev-bg flex flex-col">
                <div className="h-7 bg-dev-nav border-b border-emerald-950/40 flex items-center px-3 gap-2 font-mono text-[9px] uppercase tracking-wider text-[#8C9399]">
                  <TerminalIcon size={10} />
                  <span>Compiler Outputs</span>
                </div>
                <div ref={terminalContainerRef} className="flex-grow overflow-hidden terminal-wrapper" />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>

        {iframeUrl && (
          <>
            <PanelResizeHandle className="w-1 bg-emerald-950/40 hover:bg-dev-green/30 transition-colors cursor-col-resize" />
            <Panel defaultSize={15} minSize={10} className="bg-dev-bg-sec border-l border-emerald-950/40 flex flex-col">
              <div className="h-12 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-3 font-mono text-[10px] uppercase text-dev-text-sec">
                <span className="flex items-center gap-1.5"><Globe size={12} className="text-dev-green" /> App Preview</span>
                <button 
                  onClick={() => setIframeUrl(null)}
                  className="hover:text-dev-danger transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
              <div className="flex-grow bg-white relative">
                <iframe src={iframeUrl} className="w-full h-full border-0" />
              </div>
            </Panel>
          </>
        )}
      </PanelGroup>

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
              {/* Header */}
              <div className="w-full h-10 bg-dev-nav border-b border-emerald-950/40 flex items-center justify-between px-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setIsModalOpen(false)} className="w-2.5 h-2.5 rounded-full bg-[#FF5D73]/80 hover:bg-[#FF5D73] transition-colors cursor-pointer" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFC857]/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#37E88F]/80" />
                </div>
                <span className="text-[10px] font-mono text-dev-text-sec">sysctl --add-collaborator</span>
                <div className="w-10" />
              </div>

              <div className="p-6">
                <h2 className="text-base font-black uppercase text-dev-text mb-4 font-mono">
                  ➜ SELECT USER NODES
                </h2>
                
                <div className="max-h-60 overflow-y-auto border border-emerald-950/40 rounded bg-black/40 p-2 space-y-1.5">
                  {users.length === 0 ? (
                    <p className="text-[10px] text-dev-text-sec font-mono p-4 text-center">No nodes registered in this workspace.</p>
                  ) : null}
                  {users.map(usr => {
                    const isSelected = selectedUserId.has(usr._id);
                    return (
                      <div
                        key={usr._id || usr}
                        onClick={() => handleInviteUserClick(usr._id)}
                        className={`flex items-center justify-between p-2.5 rounded border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-dev-green/10 border-dev-green/40 text-dev-green' 
                            : 'bg-transparent border-transparent hover:bg-dev-bg-sec hover:border-emerald-950/30 text-dev-text-sec hover:text-dev-text'
                        }`}
                      >
                        <span className="font-mono text-xs truncate">{usr.email || usr.name || (typeof usr === 'string' ? usr : 'User')}</span>
                        {isSelected && <span className="text-[10px] font-bold">✔ INVITED</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-3 mt-6 font-mono text-[10px]">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-dev-text-sec hover:text-dev-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeAddCollaborators}
                    disabled={selectedUserId.size === 0}
                    className="btn-os px-4 py-2 bg-dev-green text-dev-bg font-bold uppercase rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Execute
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-[2px] pt-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-[#08110C] border border-dev-green/30 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden font-mono"
            >
              <div className="flex items-center px-4 py-3 bg-dev-nav border-b border-emerald-950/40 gap-2">
                <Search size={14} className="text-dev-green" />
                <input
                  type="text"
                  value={paletteSearch}
                  onChange={(e) => setPaletteSearch(e.target.value)}
                  placeholder="Search files or execute settings..."
                  className="flex-grow bg-transparent border-0 outline-none text-xs text-dev-green placeholder-emerald-950"
                  autoFocus
                />
                <span className="text-[9px] text-dev-text-sec bg-dev-bg px-1.5 py-0.5 rounded border border-emerald-950/40">ESC</span>
              </div>

              <div className="max-h-64 overflow-y-auto p-2">
                <div className="text-[9px] uppercase tracking-wider text-[#8C9399] px-3 py-1 mb-1.5">File Tree Sandboxes</div>
                {filteredFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      addOpenFile(file);
                      setIsPaletteOpen(false);
                      setPaletteSearch('');
                      toast.success(`Opened ${file}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs hover:bg-dev-green/5 text-dev-text-sec hover:text-dev-green transition-all cursor-pointer"
                  >
                    <span>{file}</span>
                    <span className="text-[9px] text-[#A78BFA] bg-[#A78BFA]/5 border border-[#A78BFA]/10 px-1 rounded uppercase">File</span>
                  </button>
                ))}

                <div className="text-[9px] uppercase tracking-wider text-[#8C9399] px-3 py-1 mt-3 mb-1.5">Pipeline Commands</div>
                <button
                  onClick={() => {
                    handleCompileInstall();
                    setIsPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs hover:bg-dev-green/5 text-dev-text-sec hover:text-dev-green transition-all cursor-pointer"
                >
                  <span>npm install (compiler)</span>
                  <span className="text-[9px] text-dev-green bg-dev-green/5 border border-dev-green/15 px-1 rounded uppercase">Action</span>
                </button>
                <button
                  onClick={() => {
                    handleCompileRun();
                    setIsPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs hover:bg-dev-green/5 text-dev-text-sec hover:text-dev-green transition-all cursor-pointer"
                >
                  <span>npm start (web preview)</span>
                  <span className="text-[9px] text-dev-green bg-dev-green/5 border border-dev-green/15 px-1 rounded uppercase">Action</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Project;