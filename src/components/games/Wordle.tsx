"use client";
import { useState } from "react";

const TARGET = "CYBER";

export default function Wordle() {
  const [guesses, setGuesses] = useState<string[]>(Array(6).fill(""));
  const [current, setCurrent] = useState("");
  const [row, setRow] = useState(0);

  const handleInput = (char: string) => {
    if (row >= 6) return;
    if (char === "ENTER") {
      if (current.length !== 5) return;
      const newGuesses = [...guesses];
      newGuesses[row] = current;
      setGuesses(newGuesses);
      setRow(r => r + 1);
      setCurrent("");
    } else if (char === "DEL") {
      setCurrent(c => c.slice(0, -1));
    } else {
      if (current.length < 5) setCurrent(c => c + char);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 bg-black">
      <h2 className="text-2xl mb-8 font-mono text-cyan-400">PASSWORD_DECRYPT</h2>
      
      <div className="grid grid-rows-6 gap-2 mb-8">
        {guesses.map((g, i) => (
          <div key={i} className="grid grid-cols-5 gap-2">
             {Array(5).fill("").map((_, j) => {
               const char = i === row ? current[j] : g[j];
               let bg = "bg-black";
               if (i < row) {
                 if (g[j] === TARGET[j]) bg = "bg-green-600";
                 else if (TARGET.includes(g[j])) bg = "bg-yellow-600";
                 else bg = "bg-slate-800";
               }
               return (
                 <div key={j} className={`w-12 h-12 border-2 border-slate-700 flex items-center justify-center font-bold text-xl ${bg}`}>
                   {char}
                 </div>
               );
             })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").map(char => (
          <button key={char} onClick={() => handleInput(char)} className="p-3 bg-slate-800 rounded hover:bg-slate-700">{char}</button>
        ))}
        <button onClick={() => handleInput("ENTER")} className="col-span-2 bg-cyan-700 rounded font-bold">ENTER</button>
        <button onClick={() => handleInput("DEL")} className="col-span-2 bg-red-700 rounded font-bold">DEL</button>
      </div>
    </div>
  );
}