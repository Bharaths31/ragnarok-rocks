import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto p-4 h-screen flex flex-col">
        <Navbar /> 
        {/* Main Content Area with Glassmorphism */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto rounded-3xl bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl p-6 mt-4 no-scrollbar"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}