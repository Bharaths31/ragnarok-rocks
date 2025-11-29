"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ExternalLink, BookOpen } from "lucide-react";

export default function GuidesPage() {
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      const snap = await getDocs(collection(db, "guides"));
      setGuides(snap.docs.map(d => d.data()));
    };
    fetchGuides();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
       <div className="max-w-6xl mx-auto">
         <h1 className="text-4xl font-bold mb-2 flex items-center gap-3"><BookOpen className="text-purple-500" /> Knowledge Base</h1>
         <p className="text-slate-400 mb-12">Curated resources.</p>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {guides.length === 0 ? <div className="text-slate-500">No guides added yet.</div> : guides.map((guide, idx) => (
             <a key={idx} href={guide.url} target="_blank" className="group bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all">
               <div className="w-16 h-16 bg-black rounded-xl p-3 border border-white/10 shrink-0">
                 <img src={guide.logo} alt={guide.name} className="w-full h-full object-contain" />
               </div>
               <div>
                 <h3 className="font-bold text-lg mb-1 group-hover:text-purple-400">{guide.name}</h3>
                 <span className="text-xs text-slate-500 flex items-center gap-1">Open <ExternalLink size={10} /></span>
               </div>
             </a>
           ))}
         </div>
       </div>
    </div>
  );
}