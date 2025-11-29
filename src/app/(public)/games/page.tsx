"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Gamepad2, Type, BoxSelect, Ghost } from "lucide-react";

const SnakeGame = dynamic(() => import("@/components/games/Snake"), { loading: () => <LoadingGame /> });
const TetrisGame = dynamic(() => import("@/components/games/Tetris"), { loading: () => <LoadingGame /> });
const WordleGame = dynamic(() => import("@/components/games/Wordle"), { loading: () => <LoadingGame /> });
const PacManGame = dynamic(() => import("@/components/games/PacMan"), { loading: () => <LoadingGame /> });

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<"snake" | "tetris" | "wordle" | "pacman">("pacman");

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24 selection:bg-cyan-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-400">
          Neon Arcade
        </h1>
        
        <div className="flex justify-center gap-2 md:gap-4 mb-8 flex-wrap">
          <GameTab id="pacman" name="Pac-Man" icon={<Ghost/>} active={activeGame} set={setActiveGame} />
          <GameTab id="snake" name="Snake" icon={<Gamepad2/>} active={activeGame} set={setActiveGame} />
          <GameTab id="tetris" name="Tetris" icon={<BoxSelect/>} active={activeGame} set={setActiveGame} />
          <GameTab id="wordle" name="Wordle" icon={<Type/>} active={activeGame} set={setActiveGame} />
        </div>

        <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden min-h-[500px] md:min-h-[600px] relative shadow-2xl">
          {activeGame === "snake" && <SnakeGame />}
          {activeGame === "tetris" && <TetrisGame />}
          {activeGame === "wordle" && <WordleGame />}
          {activeGame === "pacman" && <PacManGame />}
        </div>
      </div>
    </div>
  );
}

function GameTab({ id, name, icon, active, set }: any) {
  const isActive = active === id;
  return (
    <button onClick={() => set(id)} className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl border transition-all text-sm md:text-base ${isActive ? "bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(8,145,178,0.3)]" : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"}`}>
      {icon} <span className="font-bold">{name}</span>
    </button>
  );
}

function LoadingGame() { return <div className="flex h-full items-center justify-center text-cyan-500 animate-pulse">Loading Cartridge...</div>; }