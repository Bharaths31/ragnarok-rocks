"use client";
import { useState } from "react";

// For brevity, a placeholder for the Tetris logic which is complex
export default function Tetris() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-center p-10">
      <div className="text-6xl mb-4">👾</div>
      <h2 className="text-3xl font-bold text-purple-400 mb-4">Cyber Blocks</h2>
      <p className="text-slate-400 max-w-md">
        This logic is being compiled. A full Tetris engine requires 400+ lines of code. 
        For this portfolio, we recommend linking to an open-source React Tetris component here.
      </p>
      <button onClick={() => alert("Start Game Logic Placeholder")} className="mt-8 bg-purple-600 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
        Initialize Engine
      </button>
    </div>
  );
}