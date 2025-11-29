"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ExternalLink, BookOpen } from "lucide-react";

export default function GuidesPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const snap = await getDocs(collection(db, "guides"));
        // If DB is empty, use dummy data so page isn't blank
        if (snap.empty) {
           setGuides([
             { name: "React Documentation", url: "https://react.dev", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
             { name: "Next.js Mastery", url: "https://nextjs.org", logo: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" },
             { name: "Cyber Map", url: "https://map.cyberthreat.io", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/HTTP_logo.svg" }
           ]);
        } else {
           setGuides(snap.docs.map(d => d.data()));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGuides();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
       <div className="max-w-6xl mx-auto">
         <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
           <BookOpen className="text-purple-500" /> Knowledge Base
         </h1>
         <p className="text-slate-400 mb-12">Curated resources for development and security.</p>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {guides.map((guide, idx) => (
             <a 
               key={idx} 
               href={guide.url} 
               target="_blank"
               className="group bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all hover:-translate-y-1 relative overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="w-16 h-16 bg-black rounded-xl p-3 border border-white/10 shrink-0">
                 <img src={guide.logo} alt={guide.name} className="w-full h-full object-contain" />
               </div>
               
               <div className="flex-1">
                 <h3 className="font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">{guide.name}</h3>
                 <span className="text-xs text-slate-500 flex items-center gap-1">
                   View Resource <ExternalLink size={10} />
                 </span>
               </div>
             </a>
           ))}
         </div>
       </div>
    </div>
  );
}