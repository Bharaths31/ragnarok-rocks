"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { Trash2 } from "lucide-react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("handles"); // Controls which view is shown

  // Data States
  const [handles, setHandles] = useState<any[]>([]);
  const [newsTopics, setNewsTopics] = useState<any[]>([]);
  
  // Input States
  const [newHandle, setNewHandle] = useState({ platform: "", url: "" });
  const [newTopic, setNewTopic] = useState("");

  // 1. Auth Check
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) router.push("/admin/login");
      else setLoading(false);
    });
  }, [router]);

  // 2. Fetch Data (Realtime)
  useEffect(() => {
    const unsubHandles = onSnapshot(query(collection(db, "handles")), (snap) => {
      setHandles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubNews = onSnapshot(query(collection(db, "news_topics")), (snap) => {
      setNewsTopics(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubHandles();
      unsubNews();
    };
  }, []);

  // Actions
  const addHandle = async () => {
    if (!newHandle.platform || !newHandle.url) return;
    
    // Auto-fetch metadata logic (Optional, simpler version here)
    const iconUrl = `https://www.google.com/s2/favicons?domain=${newHandle.url}&sz=128`;

    await addDoc(collection(db, "handles"), {
      ...newHandle,
      icon: iconUrl
    });
    setNewHandle({ platform: "", url: "" });
  };

  const deleteItem = async (col: string, id: string) => {
    await deleteDoc(doc(db, col, id));
  };

  const addNewsTopic = async () => {
    if (!newTopic) return;
    await addDoc(collection(db, "news_topics"), { topic: newTopic, enabled: true });
    setNewTopic("");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 flex">
      {/* ✅ New Modular Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        
        {/* HANDLES TAB */}
        {activeTab === "handles" && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-3xl font-bold mb-6">Manage Social Handles</h3>
            
            {/* Add New */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
              <div className="flex gap-4">
                <input 
                  placeholder="Platform (e.g. GitHub)" 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 w-1/3 outline-none focus:border-cyan-500"
                  value={newHandle.platform}
                  onChange={(e) => setNewHandle({...newHandle, platform: e.target.value})}
                />
                <input 
                  placeholder="URL (https://...)" 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 w-1/2 outline-none focus:border-cyan-500"
                  value={newHandle.url}
                  onChange={(e) => setNewHandle({...newHandle, url: e.target.value})}
                />
                <button onClick={addHandle} className="bg-cyan-600 hover:bg-cyan-500 px-6 rounded-lg font-bold text-white transition-all">Add</button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {handles.map((h) => (
                <div key={h.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={h.icon} className="w-8 h-8 rounded-full" alt="icon" />
                    <span className="font-semibold text-cyan-300">{h.platform}</span>
                    <span className="text-slate-500 text-sm">{h.url}</span>
                  </div>
                  <button onClick={() => deleteItem("handles", h.id)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWS TAB */}
        {activeTab === "news" && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-3xl font-bold mb-6">Preferred News Topics</h3>
             <p className="text-slate-400 mb-6">The main page will fetch news based on these keywords.</p>
             
             <div className="flex gap-4 mb-8">
                <input 
                  placeholder="Topic (e.g. Quantum Computing)" 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 w-full outline-none focus:border-cyan-500"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
                <button onClick={addNewsTopic} className="bg-purple-600 hover:bg-purple-500 px-6 rounded-lg font-bold text-white transition-all whitespace-nowrap">
                  Add Topic
                </button>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {newsTopics.map((topic) => (
                 <div key={topic.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                   <span className="font-mono text-cyan-300"># {topic.topic}</span>
                   <button onClick={() => deleteItem("news_topics", topic.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-3xl font-bold mb-6">Portfolio Projects</h3>
            <div className="p-10 border border-dashed border-white/20 rounded-2xl text-center text-slate-500">
              Project Management Module Loading... <br/> (You can add fields for Project Title, Description, and Image here)
            </div>
          </div>
        )}

      </main>
    </div>
  );
}