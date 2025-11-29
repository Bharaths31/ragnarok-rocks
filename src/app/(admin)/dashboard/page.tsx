"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { Trash2, Plus, Save, Loader2, ExternalLink, BookOpen } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("handles");
  const [submitting, setSubmitting] = useState(false);

  // Data States
  const [handles, setHandles] = useState<any[]>([]);
  const [newsTopics, setNewsTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]); // New

  // Input States
  const [newHandle, setNewHandle] = useState({ platform: "", url: "" });
  const [newTopic, setNewTopic] = useState("");
  const [newGuide, setNewGuide] = useState({ name: "", url: "", logo: "" }); // New
  const [newProject, setNewProject] = useState({ 
    title: "", description: "", link: "", imageUrl: "", tech: "" 
  });

  // Auth & Data Fetching
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/admin/login");
      else setLoading(false);
    });

    if (!loading) {
      const qHandles = query(collection(db, "handles"));
      const qNews = query(collection(db, "news_topics"));
      const qProjects = query(collection(db, "projects"));
      const qGuides = query(collection(db, "guides")); // New

      const u1 = onSnapshot(qHandles, (s) => setHandles(s.docs.map(d => ({id: d.id, ...d.data()}))));
      const u2 = onSnapshot(qNews, (s) => setNewsTopics(s.docs.map(d => ({id: d.id, ...d.data()}))));
      const u3 = onSnapshot(qProjects, (s) => setProjects(s.docs.map(d => ({id: d.id, ...d.data()}))));
      const u4 = onSnapshot(qGuides, (s) => setGuides(s.docs.map(d => ({id: d.id, ...d.data()}))));

      return () => { u1(); u2(); u3(); u4(); };
    }
    return () => unsubAuth();
  }, [loading, router]);

  // Actions
  const deleteItem = async (col: string, id: string) => {
    if(confirm("Delete this item?")) await deleteDoc(doc(db, col, id));
  };

  const addHandle = async () => {
    if (!newHandle.platform || !newHandle.url) return;
    setSubmitting(true);
    let iconUrl = `https://www.google.com/s2/favicons?domain=${newHandle.url}&sz=128`;
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

  const addGuide = async () => {
    if (!newGuide.name || !newGuide.url) return;
    setSubmitting(true);
    // Use Google Favicon if logo not provided
    const logo = newGuide.logo || `https://www.google.com/s2/favicons?domain=${newGuide.url}&sz=128`;
    await addDoc(collection(db, "guides"), { ...newGuide, logo });
    setNewGuide({ name: "", url: "", logo: "" });
    setSubmitting(false);
  };

  const addProject = async () => {
    if (!newProject.title || !newProject.link) return;
    setSubmitting(true);
    await addDoc(collection(db, "projects"), {
      ...newProject,
      techStack: newProject.tech.split(",").map(t => t.trim()) 
    });
    setNewProject({ title: "", description: "", link: "", imageUrl: "", tech: "" });
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500">Loading Admin...</div>;

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
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-500">PLATFORM</label>
                <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-500" placeholder="e.g. GitHub" value={newHandle.platform} onChange={e => setNewHandle({...newHandle, platform: e.target.value})} />
              </div>
              <div className="md:col-span-6 space-y-2">
                <label className="text-xs font-bold text-slate-500">URL</label>
                <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-cyan-500" placeholder="https://..." value={newHandle.url} onChange={e => setNewHandle({...newHandle, url: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <button onClick={addHandle} disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-lg font-bold text-white flex justify-center items-center">
                  {submitting ? <Loader2 className="animate-spin"/> : <Plus />}
                </button>
              </div>
            </div>
            {/* List */}
            <div className="space-y-2">
              {handles.map(h => (
                <div key={h.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3"><img src={h.icon} className="w-8 h-8 rounded-full bg-white/10"/><span className="font-bold text-cyan-300">{h.platform}</span></div>
                  <button onClick={() => deleteItem("handles", h.id)} className="text-red-400 p-2"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- GUIDES TAB (NEW) --- */}
        {activeTab === "guides" && ( // You might need to add a button in Sidebar for 'guides'
           <div className="max-w-4xl space-y-6">
             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500" placeholder="Guide Name" value={newGuide.name} onChange={e => setNewGuide({...newGuide, name: e.target.value})} />
                  <input className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500" placeholder="URL" value={newGuide.url} onChange={e => setNewGuide({...newGuide, url: e.target.value})} />
                </div>
                <input className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-purple-500" placeholder="Custom Logo URL (Optional)" value={newGuide.logo} onChange={e => setNewGuide({...newGuide, logo: e.target.value})} />
                <button onClick={addGuide} disabled={submitting} className="bg-purple-600 hover:bg-purple-500 py-3 rounded-lg font-bold text-white">Add Guide</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {guides.map(g => (
                 <div key={g.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-3"><img src={g.logo} className="w-10 h-10 rounded object-contain bg-black p-1"/><span className="font-bold">{g.name}</span></div>
                   <button onClick={() => deleteItem("guides", g.id)} className="text-red-400 p-2"><Trash2 size={18}/></button>
                 </div>
               ))}
             </div>
           </div>
        )}
        
        {/* --- NEWS & PROJECTS (Existing Logic) --- */}
        {activeTab === "news" && (
           <div className="max-w-4xl space-y-6">
              <div className="flex gap-4">
                <input className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-pink-500" placeholder="New Topic" value={newTopic} onChange={e => setNewTopic(e.target.value)} />
                <button onClick={addNewsTopic} className="bg-pink-600 px-6 rounded-lg font-bold text-white">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">{newsTopics.map(t => <div key={t.id} className="px-4 py-2 bg-white/5 rounded-full flex gap-2 border border-white/10">{t.topic} <Trash2 size={14} className="cursor-pointer text-red-400" onClick={() => deleteItem("news_topics", t.id)}/></div>)}</div>
           </div>
        )}

        {activeTab === "projects" && (
          <div className="max-w-4xl space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                <input className="bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500" placeholder="Link" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
              </div>
              <input className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500" placeholder="Tech Stack (comma separated)" value={newProject.tech} onChange={e => setNewProject({...newProject, tech: e.target.value})} />
              <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 outline-none focus:border-emerald-500 h-24" placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              <button onClick={addProject} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg font-bold text-white">Save Project</button>
            </div>
            <div className="grid gap-4">{projects.map(p => (
               <div key={p.id} className="bg-white/5 p-4 rounded-xl border border-white/5 relative group">
                 <button onClick={() => deleteItem("projects", p.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2/></button>
                 <h4 className="font-bold text-emerald-400">{p.title}</h4>
                 <p className="text-sm text-slate-400 line-clamp-1">{p.description}</p>
               </div>
            ))}</div>
          </div>
        )}
      </main>
    </div>
  );
}