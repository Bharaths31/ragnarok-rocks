"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap } from "lucide-react";

export default function GamesPage() {
  // Simple "Hacker Tycoon" Logic
  const [bits, setBits] = useState(0);
  const [clickPower, setClickPower] = useState(1);

  const mineBitcoin = () => {
    setBits(prev => prev + clickPower);
    // Visual feedback logic could go here
  };

  const upgradeRig = () => {
    if (bits >= 50) {
      setBits(b => b - 50);
      setClickPower(p => p + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
        Cyber Arcade
      </h1>
      <p className="text-slate-400 mb-12">Experimental web toys and indie gems.</p>

      {/* The Built-in Mini Game */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        
        {/* Game 1: Bit Miner */}
        <div className="bg-slate-900/50 border border-slate-700 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu size={120} />
          </div>
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="text-yellow-400" /> Quantum Miner
          </h2>
          
          <div className="text-center py-10">
            <div className="text-6xl font-mono font-bold text-emerald-400 mb-2">{bits}</div>
            <div className="text-sm text-slate-500 uppercase tracking-widest mb-8">Quantum Bits Mined</div>
            
            <button 
              onClick={mineBitcoin}
              className="active:scale-95 transition-transform bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(8,145,178,0.5)]"
            >
              MINE DATA
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 flex justify-between items-center">
            <span className="text-slate-400">Rig Power: {clickPower} TH/s</span>
            <button 
              onClick={upgradeRig}
              disabled={bits < 50}
              className="text-xs bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Upgrade (50 Bits)
            </button>
          </div>
        </div>

        {/* External Games Links (Neal.fun style) */}
        <div className="grid grid-cols-2 gap-4">
          {['The Password Game', 'Space Elevator', 'Deep Sea', 'Asteroids'].map((game) => (
            <a 
              key={game}
              href="#" // You can replace this with actual URLs later
              className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-white/10 transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 group-hover:rotate-12 transition-transform" />
              <span className="font-bold text-slate-300">{game}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}