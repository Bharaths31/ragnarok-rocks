import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../components/AuthProvider';
import { addProject, deleteProject, addHandle, deleteHandle, addTopic, deleteTopic, addGuide, deleteGuide, updateContactInfo, fetchData, getContactInfo } from '../utils/firestore';
import type { Project, Handle, NewsTopic, Guide, ContactInfo } from '../types';
import { Trash2, Plus, Save } from 'lucide-react';

const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [handles, setHandles] = useState<Handle[]>([]);
  const [topics, setTopics] = useState<NewsTopic[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [contact, setContact] = useState<ContactInfo>({ email: '', phone: '', address: '' });

  // Load Data
  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  const loadAllData = async () => {
    setProjects(await fetchData<Project>('projects'));
    setHandles(await fetchData<Handle>('handles'));
    setTopics(await fetchData<NewsTopic>('news_topics'));
    setGuides(await fetchData<Guide>('guides'));
    const c = await getContactInfo();
    if (c) setContact(c);
  };

  // Forms State
  const [newProject, setNewProject] = useState({ title: '', description: '', imageUrl: '', technologies: '', link: '' });
  const [newHandle, setNewHandle] = useState({ platform: '', username: '', url: '' });
  const [newTopic, setNewTopic] = useState({ topic: '' });
  const [newGuide, setNewGuide] = useState({ name: '', url: '' });

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
           <h1 className="text-2xl text-red-500">Access Denied. Admins Only.</h1>
        </div>
      </Layout>
    );
  }

  // Handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject({ ...newProject, technologies: newProject.technologies.split(',').map(t => t.trim()) });
    setNewProject({ title: '', description: '', imageUrl: '', technologies: '', link: '' });
    loadAllData();
  };

  const handleAddHandle = async (e: React.FormEvent) => {
     e.preventDefault();
     // Mock fetch profile photo logic could go here
     await addHandle({ ...newHandle, iconUrl: `https://ui-avatars.com/api/?name=${newHandle.platform}&background=random` });
     setNewHandle({ platform: '', username: '', url: '' });
     loadAllData();
  };

  const handleAddTopic = async (e: React.FormEvent) => {
      e.preventDefault();
      await addTopic(newTopic);
      setNewTopic({ topic: '' });
      loadAllData();
  };

  const handleAddGuide = async (e: React.FormEvent) => {
      e.preventDefault();
      await addGuide(newGuide);
      setNewGuide({ name: '', url: '' });
      loadAllData();
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateContactInfo(contact);
      alert('Contact Info Updated');
  };

  const tabs = ['projects', 'handles', 'news', 'guides', 'contact'];

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-neon-green">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 overflow-x-auto pb-2">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full capitalize whitespace-nowrap ${activeTab === tab ? 'bg-neon-blue text-black font-bold' : 'bg-white/5 text-gray-400'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="glass-panel-dark p-6 rounded-xl min-h-[400px]">
            {activeTab === 'projects' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Manage Projects</h2>
                    <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Title" className="p-2 bg-black/20 rounded border border-white/10" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                        <input placeholder="Description" className="p-2 bg-black/20 rounded border border-white/10" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                        <input placeholder="Image URL" className="p-2 bg-black/20 rounded border border-white/10" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                        <input placeholder="Technologies (comma sep)" className="p-2 bg-black/20 rounded border border-white/10" value={newProject.technologies} onChange={e => setNewProject({...newProject, technologies: e.target.value})} />
                        <input placeholder="Link" className="p-2 bg-black/20 rounded border border-white/10" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
                        <button type="submit" className="md:col-span-2 bg-neon-blue/20 text-neon-blue py-2 rounded hover:bg-neon-blue hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Plus size={18} /> Add Project
                        </button>
                    </form>
                    <div className="space-y-2">
                        {projects.map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-white/5 p-4 rounded">
                                <span>{p.title}</span>
                                <button onClick={async () => { await deleteProject(p.id); loadAllData(); }} className="text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'handles' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Manage Social Handles</h2>
                    <form onSubmit={handleAddHandle} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input placeholder="Platform" className="p-2 bg-black/20 rounded border border-white/10" value={newHandle.platform} onChange={e => setNewHandle({...newHandle, platform: e.target.value})} required />
                        <input placeholder="Username" className="p-2 bg-black/20 rounded border border-white/10" value={newHandle.username} onChange={e => setNewHandle({...newHandle, username: e.target.value})} required />
                        <input placeholder="URL" className="p-2 bg-black/20 rounded border border-white/10" value={newHandle.url} onChange={e => setNewHandle({...newHandle, url: e.target.value})} required />
                        <button type="submit" className="md:col-span-3 bg-neon-blue/20 text-neon-blue py-2 rounded hover:bg-neon-blue hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Plus size={18} /> Add Handle
                        </button>
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {handles.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/5 p-4 rounded">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">{h.platform}</span>
                                    <span className="text-gray-400 text-sm">@{h.username}</span>
                                </div>
                                <button onClick={async () => { await deleteHandle(h.id); loadAllData(); }} className="text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'news' && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Manage News Topics</h2>
                    <form onSubmit={handleAddTopic} className="flex gap-4">
                        <input placeholder="Topic (e.g. Quantum Computing)" className="flex-1 p-2 bg-black/20 rounded border border-white/10" value={newTopic.topic} onChange={e => setNewTopic({...newTopic, topic: e.target.value})} required />
                        <button type="submit" className="bg-neon-blue/20 text-neon-blue px-6 rounded hover:bg-neon-blue hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Plus size={18} /> Add
                        </button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                        {topics.map(t => (
                            <div key={t.id} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full">
                                <span>{t.topic}</span>
                                <button onClick={async () => { await deleteTopic(t.id); loadAllData(); }} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'guides' && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Manage Guides</h2>
                     <form onSubmit={handleAddGuide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Website Name" className="p-2 bg-black/20 rounded border border-white/10" value={newGuide.name} onChange={e => setNewGuide({...newGuide, name: e.target.value})} required />
                        <input placeholder="URL" className="p-2 bg-black/20 rounded border border-white/10" value={newGuide.url} onChange={e => setNewGuide({...newGuide, url: e.target.value})} required />
                        <button type="submit" className="md:col-span-2 bg-neon-blue/20 text-neon-blue py-2 rounded hover:bg-neon-blue hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Plus size={18} /> Add Guide
                        </button>
                    </form>
                    <div className="space-y-2">
                        {guides.map(g => (
                            <div key={g.id} className="flex justify-between items-center bg-white/5 p-4 rounded">
                                <a href={g.url} target="_blank" className="hover:text-neon-blue">{g.name}</a>
                                <button onClick={async () => { await deleteGuide(g.id); loadAllData(); }} className="text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'contact' && (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Update Contact Info</h2>
                    <form onSubmit={handleUpdateContact} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <input value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} className="w-full p-2 bg-black/20 rounded border border-white/10" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Phone</label>
                            <input value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} className="w-full p-2 bg-black/20 rounded border border-white/10" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Address</label>
                            <input value={contact.address} onChange={e => setContact({...contact, address: e.target.value})} className="w-full p-2 bg-black/20 rounded border border-white/10" />
                        </div>
                        <button type="submit" className="bg-neon-green/20 text-neon-green py-2 px-6 rounded hover:bg-neon-green hover:text-black transition-colors flex items-center justify-center gap-2">
                           <Save size={18} /> Update Info
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
