import {motion, transform, translateAxis} from 'motion/react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { UserContext } from '../context/user.context';


const Home = () => {
    const { user } = useContext(UserContext);
   
    return (
        <>
         {/* <div className="min-h-screen w-full text-center flex flex-col justify-center bg-black items-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}className="text-8xl text-white font-bold ">Welome to DevChat</motion.div>
              <motion.div initial={{x:-100}} animate={{x:0}} transition={{duration:3,ease:"easeInOut"}} className="text-5xl text-[#0F9B0F]">Build, Run & Discuss Code — In Real Time. </motion.div>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{x:-20,duration:3,ease:"easeInOut"}} className="text-3xl text-center  text-white">A collaborative developer workspace with real-time chat, in-browser code execution, and AI assistance  </motion.div>
            <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:4}} className='text-white mt-4 '> — all in one place. </motion.div>
              <motion.div className='bg-transparent text-white border-2 mt-5 border-white/20 text-2xl py-3 shadow-sm shadow-zinc-50 px-5 rounded-2xl' initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:4}}> 
                   <Link to={'/MyGD'}>My Projects </Link> 
              </motion.div>
            </div>

        <div className="min-h-screen bg-blue-700">
            HOme comp2 
        </div> */}
        <section className="min-h-screen hero flex items-center bg-gradient-to-br from-black via-zinc-900 to-black">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
    
    <div>
      <motion.h1 initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:2}} className="text-4xl md:text-5xl font-bold text-white leading-tight">
        Build, Run & Discuss Code — <br /> In Real Time.
      </motion.h1>

      <motion.p initial={{x:-100,opacity:0}} animate={{x:0,opacity:1}} transition={{duration:2}} className="mt-6 text-zinc-400 text-lg">
        A collaborative developer workspace with real-time chat,
        in-browser code execution, and AI assistance — all in one place.
      </motion.p>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:3}}className="mt-8 flex gap-4">
        {user ?<Link to='/MyGD' className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
          Start a Room
        </Link> : <Link className='text-white bg-blue-500 px-4 py-2 rounded-2xl text-xl' to={'/Register'} > Start Now </Link>}
        <button onClick={()=>{
            console.log("button clicked")
            document.querySelector('.working')?.scrollIntoView({
                behavior: 'smooth'
            })
        }} className="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg">
          See How It Works
        </button>
      </motion.div>
    </div>

    <div className="hidden md:block">
      {/* App screenshot / illustration */}
    </div>
  </div>
</section>
<section className="py-10 sec-2 bg-zinc-950 border-t border-zinc-800">
  <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-zinc-400 text-sm">
    <span>⚡ Real-time Collaboration</span>
    <span>🤖 AI-assisted Chat</span>
    <span>💻 Runs Code in Browser</span>
  </div>
</section>

<section className="py-24 bg-black">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-semibold text-white text-center">
      Everything Developers Need to Collaborate
    </h2>

    <div className="mt-16 grid md:grid-cols-3 gap-10">
      {[
        {
          title: "Real-Time Developer Chat",
          desc: "Collaborate instantly with developers in shared rooms using fast, reliable real-time messaging."
        },
        {
          title: "AI in the Conversation",
          desc: "Mention @ai anytime to get explanations, debug help, or code suggestions inside the chat."
        },
        {
          title: "Run Code in the Browser",
          desc: "Run servers and code directly in the browser using WebContainers — zero setup required."
        }
      ].map((f) => (
        <div key={f.title} className="p-6 border border-zinc-800 rounded-xl bg-zinc-950">
          <h3 className="text-xl font-medium text-white">{f.title}</h3>
          <p className="mt-3 text-zinc-400">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="py-24 working bg-zinc-950">
  <div className="max-w-4xl mx-auto px-6">
    <h2 className="text-3xl font-semibold \ text-white text-center">
      How It Works
    </h2>

    <ol className="mt-12 space-y-6 text-zinc-400">
      <li>1. Create or join a collaboration room</li>
      <li>2. Chat with developers in real time</li>
      <li>3. Write and run code directly in the browser</li>
      <li>4. Mention <span className="text-white">@ai</span> whenever you need help</li>
      <li>5. Learn, debug, and build — together</li>
    </ol>
  </div>
</section>
<section className="py-24 bg-black">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
    
    <div>
      <h3 className="text-xl text-white font-semibold">For Developers</h3>
      <p className="mt-3 text-zinc-400">
        Pair program, debug together, and discuss architecture in real time.
      </p>
    </div>

    <div>
      <h3 className="text-xl text-white font-semibold">For Students</h3>
      <p className="mt-3 text-zinc-400">
        Learn collaboratively, run code instantly, and ask AI without hesitation.
      </p>
    </div>

    <div>
      <h3 className="text-xl text-white font-semibold">For Teams</h3>
      <p className="mt-3 text-zinc-400">
        Lightweight collaboration for remote teams and fast technical discussions.
      </p>
    </div>

  </div>
</section>
<section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-center">
  <h2 className="text-3xl font-bold text-white">
    Start Collaborating in Seconds
  </h2>
  <p className="mt-4 text-indigo-100">
    No setup. No installation. Just code and collaborate.
  </p>
  {user?<Link to={'/MyGD'} className=" mt-20 px-8 py-2 bg-black text-white rounded-lg">
    My Communites
  </Link>: <Link className='text-white mt-20 bg-blue-500 px-4 py-2 rounded-2xl text-xl' to={'/Register'}> Create Your First Room</Link>  }
</section>
<footer className="py-8 bg-black border-t border-zinc-800 text-center text-zinc-500 text-sm">
  © 2026 • Built for developers, by a developer.
</footer>


        </>
    )
}

export default Home