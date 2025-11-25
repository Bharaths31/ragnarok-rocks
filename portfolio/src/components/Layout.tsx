import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Gamepad2, Newspaper, PenTool, Layout as LayoutIcon, Lock } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const navItems = [
    { path: '/', label: 'Home', icon: LayoutIcon },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/tools', label: 'Tools', icon: PenTool },
    { path: '/admin', label: 'Admin', icon: Lock },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/20 dark:border-white/5 transition-all duration-300">
      <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
        Portfolio
      </Link>

      <div className="flex items-center gap-6">
        {navItems.map((item) => {
           const Icon = item.icon;
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.path}
               to={item.path}
               className={clsx(
                 "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                 isActive
                   ? "bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                   : "hover:bg-white/5 text-gray-600 dark:text-gray-300 hover:text-neon-blue"
               )}
             >
               <Icon size={18} />
               <span className="hidden md:inline">{item.label}</span>
             </Link>
           );
        })}

        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cyber-dark text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <main className="pt-24 px-6 md:px-12 lg:px-24 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
