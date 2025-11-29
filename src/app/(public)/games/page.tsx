"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Target, Grid3X3, MousePointer2 } from "lucide-react";

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<"miner" | "aim" | "puzzle">("miner");

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
          Cyber Arcade
        </h1>

        {/* Game Selector Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <GameTab name="Quantum Miner" icon={<Cpu/>} isActive={activeGame === "miner"} onClick={() => setActiveGame("miner")} />
          <GameTab name="Aim Trainer" icon={<Target/>} isActive={activeGame === "aim"} onClick={() => setActiveGame("aim")} />
          <GameTab name="Memory Grid" icon={<Grid3X3/>} isActive={activeGame === "puzzle"} onClick={() => setActiveGame("puzzle")} />
        </div>

        {/* Game Area */}
        <div className="bg-slate-900/50 border border-slate-700 p-4 md:p-8 rounded-3xl min-h-[500px] relative overflow-hidden">
          {activeGame === "miner" && <MinerGame />}
          {activeGame === "aim" && <AimTrainer />}
          {activeGame === "puzzle" && <MemoryPuzzle />}
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function GameTab({ name, icon, isActive, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${isActive ? "bg-cyan-600 border-cyan-400 text-white" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"}`}>
      {icon} {name}
    </button>
  );
}

// 1. Existing Miner Game
function MinerGame() {
  const [bits, setBits] = useState(0);
  return (
    <div className="text-center py-20">
       <h2 className="text-2xl font-bold mb-4">Quantum Miner</h2>
       <div className="text-6xl font-mono text-emerald-400 mb-8">{bits}</div>
       <button onClick={() => setBits(b => b + 1)} className="bg-cyan-600 px-8 py-4 rounded-full font-bold active:scale-95 transition-transform">
         MINE DATA
       </button>
    </div>
  );
}

// 2. Aim Trainer (DPI Test)
function AimTrainer() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [timeLeft, setTimeLeft] = useState(30);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (playing && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPlaying(false);
    }
  }, [timeLeft, playing]);

  const moveTarget = () => {
    if (!playing) return;
    setScore(s => s + 1);
    const x = Math.random() * 80 + 10; // keep within 10-90%
    const y = Math.random() * 80 + 10;
    setPosition({ top: `${y}%`, left: `${x}%` });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setPlaying(true);
    moveTarget();
  };

  return (
    <div className="h-[400px] w-full relative select-none">
      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-2">Score: {score}</h2>
          <button onClick={startGame} className="bg-emerald-500 text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform">
            {timeLeft === 0 ? "Play Again" : "Start Aim Test"}
          </button>
        </div>
      )}
      
      <div className="absolute top-4 left-4 font-mono text-xl">Time: {timeLeft}s</div>
      <div className="absolute top-4 right-4 font-mono text-xl text-cyan-400">Hits: {score}</div>

      {playing && (
        <div 
          onClick={moveTarget}
          style={{ top: position.top, left: position.left }}
          className="absolute w-12 h-12 bg-red-500 rounded-full border-4 border-white cursor-crosshair transform -translate-x-1/2 -translate-y-1/2 active:scale-90 transition-transform duration-75"
        >
           <div className="w-full h-full flex items-center justify-center">
             <div className="w-2 h-2 bg-white rounded-full"/>
           </div>
        </div>
      )}
    </div>
  );
}

// 3. Memory Puzzle (Simon/Grid style)
function MemoryPuzzle() {
  const [grid, setGrid] = useState(Array(16).fill(false));
  
  const randomize = () => {
    const newGrid = Array(16).fill(false).map(() => Math.random() > 0.7);
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Pattern Decryptor</h2>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {grid.map((active, i) => (
          <div 
            key={i} 
            onClick={() => {
               const n = [...grid]; 
               n[i] = !n[i]; 
               setGrid(n);
            }}
            className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 ${active ? "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]" : "bg-white/5 hover:bg-white/10"}`}
          />
        ))}
      </div>
      <button onClick={randomize} className="text-sm text-slate-400 underline decoration-dotted">
        Reset Sequence
      </button>
    </div>
  );
}