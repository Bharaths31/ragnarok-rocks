"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Cpu, Gamepad2, Newspaper, Wrench } from "lucide-react";

export default function Home() {
  const [handles, setHandles] = useState<any[]>([]);

  useEffect(() => {
    const fetchHandles = async () => {
      const snap = await getDocs(collection(db, "handles"));
      setHandles(snap.docs.map(doc => doc.data()));
    };
    fetchHandles();
  }, []);

  const navItems = [
    { name: "News Feed", icon: <Newspaper />, href: "/news", color: "from-pink-500 to-rose-500" },
    { name: "Guides", icon: <Terminal />, href: "/guides", color: "from-purple-500 to-indigo-500" },
    { name: "Tools", icon: <Wrench />, href: "/tools", color: "from-cyan-500 to-blue-500" },
    { name: "Arcade", icon: <Gamepad2 />, href: "/games", color: "from-emerald-400 to-cyan-500" },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-cyan-500 selection:text-black">
      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-center text-center">
        
        {/* Profile Avatar with 'Breathing' Glow */}
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
          <div className="relative w-32 h-32 rounded-full bg-black flex items-center justify-center border-2 border-white/10 overflow-hidden">
             {/* Replace src with your actual image URL or fetch from DB */}
             <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-white to-purple-300 mb-6"
        >
          Cyber<span className="text-cyan-500">.</span>Dev
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="max-w-2xl text-slate-400 mb-10 text-lg md:text-xl font-light"
        >
          Architecting the future with <span className="text-cyan-400">Quantum Tech</span>, <span className="text-purple-400">Cyber Security</span>, and <span className="text-emerald-400">Indie Games</span>.
        </motion.p>

        {/* Social Handles (Auto-Fetched) */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-20"
        >
          {handles.map((handle, idx) => (
            <a 
              key={idx} href={handle.url} target="_blank"
              className="flex items-center gap-3 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-500/50"
            >
              <img src={handle.icon} className="w-5 h-5 rounded-sm" alt="" />
              <span className="font-medium text-sm text-slate-300">{handle.platform}</span>
            </a>
          ))}
        </motion.div>
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
           {navItems.map((item, index) => (
             <motion.div
               key={item.name}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 + (index * 0.1) }}
             >
               <Link 
                 href={item.href}
                 className="group relative block p-8 rounded-3xl bg-white/5 border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 h-full"
               >
                 <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${item.color} transition-opacity duration-500`} />
                 <div className="relative z-10 flex flex-col items-center">
                   <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-4 shadow-lg`}>
                     {item.icon}
                   </div>
                   <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                   <div className="w-8 h-1 bg-white/20 rounded-full group-hover:w-16 transition-all duration-300" />
                 </div>
               </Link>
             </motion.div>
           ))}
        </div>
      </div>
    </main>
  );
}