"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { Trash2, Plus, Save, Loader2, ExternalLink } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("handles");
  const [submitting, setSubmitting] = useState(false);

  // --- Data States ---
  const [handles, setHandles] = useState<any[]>([]);
  const [newsTopics, setNewsTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // --- Input States ---
  const [newHandle, setNewHandle] = useState({ platform: "", url: "" });
  const [newTopic, setNewTopic] = useState("");
  const [newProject, setNewProject] = useState({ 
    title: "", 
    description: "", 
    link: "", 
    imageUrl: "",
    tech: "" // We will split this by comma later
  });

  // 1. Auth Check
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/admin/login");
      else setLoading(false);
    });
    return () => unsub();
  }, [router]);

  // 2. Real-time Data Fetching
  useEffect(() => {
    if (loading) return;

    // Fetch Handles
    const unsubHandles = onSnapshot(query(collection(db, "handles")), (snap) => {
      setHandles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Fetch News Topics
    const unsubNews = onSnapshot(query(collection(db, "news_topics")), (snap) => {
      setNewsTopics(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Fetch Projects (This was missing before)
    const unsubProjects = onSnapshot(query(collection(db, "projects")), (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubHandles();
      unsubNews();
      unsubProjects();
    };
  }, [loading]);

  // --- Actions ---

  const deleteItem = async (col: string, id: string) => {
    if(confirm("Delete this item?")) {
      await deleteDoc(doc(db, col, id));
    }
  };

  const addHandle = async () => {
    if (!newHandle.platform || !newHandle.url) return alert("Fill all fields");
    setSubmitting(true);
    
    // Default Icon fallback
    let iconUrl = `https://www.google.com/s2/favicons?domain=${newHandle.url}&sz=128`;
    
    // Attempt to auto-fetch better metadata
    try {
       const res = await fetch(`/api/fetch-metadata?url=${encodeURIComponent(newHandle.url)}`);
       if(res.ok) {
         const data = await res.json();
         if(data.image) iconUrl = data.image;
       }
    } catch (e) { console.log("Metadata fetch failed, using default."); }

    await addDoc(collection(db, "handles"), { ...newHandle, icon: iconUrl });
    setNewHandle({ platform: "", url: "" });
    setSubmitting(false);
  };

  const addNewsTopic = async () => {
    if (!newTopic) return;
    setSubmitting(true);
    await addDoc(collection(db, "news_topics"), { topic: newTopic, enabled: true });
    setNewTopic("");
    setSubmitting(false);
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.link) return alert("Title and Link are required");
    setSubmitting(true);
    
    await addDoc(collection(db, "projects"), {
      ...newProject,
      // Convert "React, Firebase" -> ["React", "Firebase"]
      techStack: newProject.tech.split(",").map(t => t.trim()) 
    });
    
    setNewProject({ title: "", description: "", link: "", imageUrl: "", tech: "" });
    setSubmitting(false);
  };


  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500">Loading Admin Core...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 flex overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 capitalize text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          {activeTab} Manager
        </h1>

        {/* --- HANDLES TAB --- */}
        {activeTab === "handles" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs uppercase text-slate-500 font-bold">Platform</label>
                <input 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-500"
                  placeholder="e.g. GitHub"
                  value={newHandle.platform}
                  onChange={e => setNewHandle({...newHandle, platform: e.target.value})}
                />
              </div>
              <div className="flex-[2] space-y-2">
                <label className="text-xs uppercase text-slate-500 font-bold">URL</label>
                <input 
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-500"
                  placeholder="https://..."
                  value={newHandle.url}
                  onChange={e => setNewHandle({...newHandle, url: e.target.value})}
                />
              </div>
              <button onClick={addHandle} disabled={submitting} className="bg-cyan-600 hover:bg-cyan-500 px-6 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin"/> : <Plus />}
              </button>
            </div>

            <div className="grid gap-3">
              {handles.map((h) => (
                <div key={h.id} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={h.icon} className="w-10 h-10 rounded-full object-cover bg-white/10" alt={h.platform} />
                    <div>
                      <h4 className="font-bold text-cyan-300">{h.platform}</h4>
                      <p className="text-xs text-slate-500 truncate w-64">{h.url}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteItem("handles", h.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NEWS TAB --- */}
        {activeTab === "news" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex gap-4">
               <input 
                 className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500"
                 placeholder="New Topic (e.g. Cybersecurity)"
                 value={newTopic}
                 onChange={e => setNewTopic(e.target.value)}
               />
               <button onClick={addNewsTopic} disabled={submitting} className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-bold text-white disabled:opacity-50">
                 Add Topic
               </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {newsTopics.map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                  <span className="text-purple-300"># {t.topic}</span>
                  <button onClick={() => deleteItem("news_topics", t.id)} className="text-slate-500 hover:text-red-400 ml-2"><Trash2 size={14}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PROJECTS TAB (Currently just placeholder in your file, this fixes it) --- */}
        {activeTab === "projects" && (
          <div className="max-w-4xl space-y-8">
            {/* Project Input Form */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-bold text-slate-300">Add New Project</h3>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Project Title" 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
                <input 
                  placeholder="Project Link (https://...)" 
                  className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500"
                  value={newProject.link}
                  onChange={e => setNewProject({...newProject, link: e.target.value})}
                />
              </div>
              <input 
                placeholder="Tech Stack (comma separated: React, Firebase, AI)" 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500"
                value={newProject.tech}
                onChange={e => setNewProject({...newProject, tech: e.target.value})}
              />
               <input 
                placeholder="Image URL (optional)" 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500"
                value={newProject.imageUrl}
                onChange={e => setNewProject({...newProject, imageUrl: e.target.value})}
              />
              <textarea 
                placeholder="Description" 
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500 h-24"
                value={newProject.description}
                onChange={e => setNewProject({...newProject, description: e.target.value})}
              />
              <div className="flex justify-end">
                <button onClick={addProject} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-lg font-bold text-white disabled:opacity-50 flex items-center gap-2">
                  {submitting ? <Loader2 className="animate-spin"/> : <Save size={18} />} Save Project
                </button>
              </div>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-emerald-500/30 transition-all group relative">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => deleteItem("projects", p.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button>
                  </div>
                  <h4 className="text-xl font-bold text-emerald-300 mb-1">{p.title}</h4>
                  <a href={p.link} target="_blank" className="text-xs text-slate-500 flex items-center gap-1 mb-3 hover:text-white">
                    {p.link} <ExternalLink size={10}/>
                  </a>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.techStack && p.techStack.map((t: string, i: number) => (
                      <span key={i} className="text-[10px] uppercase font-bold bg-white/10 px-2 py-1 rounded text-slate-300">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}