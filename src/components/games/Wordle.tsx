"use client";
import { useState, useEffect, useCallback } from "react";

const WORD_BANK = ["CYBER", "LINUX", "CLOUD", "REACT",
                   "LOGIC", "PIXEL", "STACK", "GHOST",
                   "ALPHA", "OMEGA", "NEON", "HACKER",
                   "NODES", "CRYPT", "SHELL","HENTAI",
                   "GOLD","TENTACLE","FISH","MINECRAFT"
                  ];

export default function Wordle() {
  const [target, setTarget] = useState("");
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [current, setCurrent] = useState("");
  const [row, setRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  // Start New Game
  const newGame = useCallback(() => {
    const random = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    setTarget(random);
    setGuesses(Array(6).fill(""));
    setCurrent("");
    setRow(0);
    setGameOver(false);
    setMessage("");
  }, []);

  // Run once on mount
  useEffect(() => { newGame(); }, [newGame]);

  // Main Input Logic
  const handleInput = useCallback((char: string) => {
    if (gameOver) return;

    if (char === "ENTER") {
      if (current.length !== 5) return;
      
      // Update Guesses
      const newGuesses = [...guesses];
      newGuesses[row] = current;
      setGuesses(newGuesses);
      
      // Check Win/Loss
      if (current === target) {
        setGameOver(true);
        setMessage("ACCESS GRANTED");
      } else if (row === 5) {
        setGameOver(true);
        setMessage(`ACCESS DENIED. CODE: ${target}`);
      }
      
      // Move to next row
      setRow(r => r + 1);
      setCurrent("");

    } else if (char === "DEL") {
      setCurrent(c => c.slice(0, -1));

    } else {
      // Add character if limit not reached
      if (current.length < 5) setCurrent(c => c + char);
    }
  }, [gameOver, current, row, guesses, target]);

  // --- NEW: Physical Keyboard Listener ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        handleInput("ENTER");
      } else if (key === "BACKSPACE") {
        handleInput("DEL");
      } else if (/^[A-Z]$/.test(key) && key.length === 1) {
        // Only allow single letters A-Z (prevents "SHIFT", "ALT" etc)
        handleInput(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, gameOver]); 


  return (
    <div className="flex flex-col items-center justify-center h-full py-10 bg-black outline-none" tabIndex={0}>
      <h2 className="text-2xl mb-4 font-mono text-cyan-400">PASSWORD_DECRYPT</h2>
      {message && <div className="mb-4 text-emerald-400 font-bold animate-pulse">{message}</div>}
      
      {/* Grid */}
      <div className="grid grid-rows-6 gap-2 mb-8">
        {guesses.map((g, i) => (
          <div key={i} className="grid grid-cols-5 gap-2">
             {Array(5).fill("").map((_, j) => {
               const char = i === row ? current[j] : g[j];
               let bg = "bg-black";
               let border = "border-slate-700";

               // Color Logic
               if (i < row) {
                 border = "border-transparent";
                 if (g[j] === target[j]) bg = "bg-emerald-600";
                 else if (target.includes(g[j])) bg = "bg-yellow-600";
                 else bg = "bg-slate-800";
               } else if (i === row && current[j]) {
                 border = "border-cyan-500"; // Highlight active typing
               }

               return (
                 <div key={j} className={`w-12 h-12 border-2 ${border} flex items-center justify-center font-bold text-xl ${bg} transition-all`}>
                   {char}
                 </div>
               );
             })}
          </div>
        ))}
      </div>

      {/* On-Screen Keyboard */}
      <div className="grid grid-cols-7 gap-1 mb-6 max-w-md">
        {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").map(char => (
          <button 
            key={char} 
            onClick={() => handleInput(char)} 
            className="p-3 bg-slate-800 rounded hover:bg-slate-700 active:bg-slate-600 transition-colors"
          >
            {char}
          </button>
        ))}
        <button onClick={() => handleInput("ENTER")} className="col-span-2 bg-cyan-700 hover:bg-cyan-600 rounded font-bold">ENT</button>
        <button onClick={() => handleInput("DEL")} className="col-span-2 bg-red-700 hover:bg-red-600 rounded font-bold">DEL</button>
      </div>

      <button onClick={newGame} className="bg-white/10 px-6 py-2 rounded text-slate-400 hover:text-white hover:bg-white/20 transition-all">
        Generate New Code
      </button>
    </div>
  );
}