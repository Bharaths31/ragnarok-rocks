import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { motion } from 'framer-motion';
import { fetchData, getContactInfo } from '../utils/firestore';
import type { Project, Handle, ContactInfo } from '../types';
import { Github, Twitter, Linkedin, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [handles, setHandles] = useState<Handle[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const load = async () => {
        setProjects(await fetchData<Project>('projects'));
        setHandles(await fetchData<Handle>('handles'));
        setContact(await getContactInfo());
    };
    load();
  }, []);

  const getIcon = (platform: string) => {
      const p = platform.toLowerCase();
      if (p.includes('github')) return <Github size={20} />;
      if (p.includes('twitter') || p.includes('x')) return <Twitter size={20} />;
      if (p.includes('linkedin')) return <Linkedin size={20} />;
      return <ExternalLink size={20} />;
  };

  return (
    <Layout>
      <div className="flex flex-col gap-12">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col justify-center items-start gap-6 relative">
          <div className="absolute top-0 right-0 p-4 flex gap-4">
             {handles.map((h, i) => (
                 <motion.a
                    key={h.id}
                    href={h.url}
                    target="_blank"
                    className="p-3 bg-white/5 rounded-full hover:bg-neon-blue hover:text-black transition-all border border-white/10"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    title={`@${h.username}`}
                 >
                    {getIcon(h.platform)}
                 </motion.a>
             ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold shiny-text mb-4">
              Welcome
            </h1>
            <h2 className="text-3xl md:text-4xl text-gray-700 dark:text-gray-300">
              I build things for the <span className="text-neon-purple">Future</span>.
            </h2>
          </motion.div>

          <motion.p
            className="max-w-2xl text-lg text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Passionate about Cyber Security, Indie Game Dev, and Quantum Technology.
            Exploring the boundaries of what's possible in the digital realm.
          </motion.p>
        </section>

        {/* Categories / Themes */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {['Cyber Security', 'Game Development', 'Quantum Tech'].map((theme, i) => (
             <motion.div
               key={theme}
               className="glass-panel-dark p-8 rounded-2xl hover:scale-105 transition-transform cursor-default border-t-2 border-transparent hover:border-neon-blue"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 * i + 0.5 }}
             >
               <h3 className="text-2xl font-bold text-neon-blue mb-2">{theme}</h3>
               <p className="text-sm text-gray-400">
                 Diving deep into {theme.toLowerCase()} to create innovative solutions.
               </p>
             </motion.div>
           ))}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
             Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-12 bg-white/5 rounded-xl">
                    No projects added yet. Check back soon!
                </div>
            ) : projects.map((p) => (
                <motion.div
                    key={p.id}
                    className="glass-panel-dark p-6 rounded-xl flex flex-col gap-4 hover:border-neon-purple transition-colors group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />}
                    <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-neon-purple transition-colors">{p.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {p.technologies.map(t => (
                                <span key={t} className="text-xs px-2 py-1 rounded bg-white/10 text-neon-blue">{t}</span>
                            ))}
                        </div>
                        {p.link && (
                            <a href={p.link} target="_blank" className="text-sm font-bold flex items-center gap-1 hover:text-neon-purple">
                                View Project <ExternalLink size={14} />
                            </a>
                        )}
                    </div>
                </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="pb-12 border-t border-white/10 pt-12">
            <h2 className="text-4xl font-bold mb-8 shiny-text">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contact?.email && (
                    <div className="glass-panel-dark p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                        <div className="p-4 rounded-full bg-neon-blue/10 text-neon-blue">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-bold">Email</h3>
                        <p className="text-gray-400">{contact.email}</p>
                    </div>
                )}
                {contact?.phone && (
                    <div className="glass-panel-dark p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                        <div className="p-4 rounded-full bg-neon-purple/10 text-neon-purple">
                            <Phone size={32} />
                        </div>
                        <h3 className="text-xl font-bold">Phone</h3>
                        <p className="text-gray-400">{contact.phone}</p>
                    </div>
                )}
                 {contact?.address && (
                    <div className="glass-panel-dark p-6 rounded-xl flex flex-col items-center gap-4 text-center">
                         <div className="p-4 rounded-full bg-neon-green/10 text-neon-green">
                            <MapPin size={32} />
                        </div>
                        <h3 className="text-xl font-bold">Location</h3>
                        <p className="text-gray-400">{contact.address}</p>
                    </div>
                )}
            </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
