"use client";
import { useEffect, useRef, useState } from "react";

// 0=Dot, 1=Wall, 2=Empty, 3=Power, 4=GhostHouse
const CLASSIC_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,3,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,3,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,4,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,1,4,4,4,1,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,3,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export default function PacMan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const blockSize = 25; // Smaller blocks for larger map feel
    const rows = CLASSIC_MAP.length;
    const cols = CLASSIC_MAP[0].length;
    canvas.width = cols * blockSize;
    canvas.height = rows * blockSize;

    // --- State ---
    let map = JSON.parse(JSON.stringify(CLASSIC_MAP));
    let pacman = { x: 9, y: 8, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 }, mouth: 0.2 };
    
    let ghosts = [
      { x: 9, y: 6, color: "red", dir: {x:0, y:-1} }, // Blinky
      { x: 8, y: 6, color: "pink", dir: {x:0, y:-1} }, // Pinky
      { x: 10, y: 6, color: "cyan", dir: {x:0, y:-1} }  // Inky
    ];

    let frame = 0;
    let scoreLocal = 0;
    let powerMode = 0;
    let animId: number;

    const isValid = (x: number, y: number) => {
      return map[y] && map[y][x] !== 1;
    };

    const draw = () => {
      // 1. Draw Map
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let dotsLeft = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (map[y][x] === 1) {
            ctx.fillStyle = "#1e3a8a"; // Blue Walls
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.strokeStyle = "#3b82f6";
            ctx.strokeRect(x * blockSize + 4, y * blockSize + 4, blockSize - 8, blockSize - 8);
          } else if (map[y][x] === 0) {
            dotsLeft++;
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(x * blockSize + blockSize/2, y * blockSize + blockSize/2, 3, 0, Math.PI*2);
            ctx.fill();
          } else if (map[y][x] === 3) {
            dotsLeft++;
            ctx.fillStyle = frame % 20 < 10 ? "#fff" : "#fbbf24"; // Flashing Pellet
            ctx.beginPath();
            ctx.arc(x * blockSize + blockSize/2, y * blockSize + blockSize/2, 6, 0, Math.PI*2);
            ctx.fill();
          }
        }
      }

      if (dotsLeft === 0) {
        setGameState("won");
        cancelAnimationFrame(animId);
        return;
      }

      // 2. Logic Update (Every 8 frames for speed control)
      frame++;
      if (frame % 8 === 0) {
        // --- Pacman ---
        // Try turn
        if (isValid(pacman.x + pacman.nextDir.x, pacman.y + pacman.nextDir.y)) {
          pacman.dir = pacman.nextDir;
        }
        // Move
        if (isValid(pacman.x + pacman.dir.x, pacman.y + pacman.dir.y)) {
          pacman.x += pacman.dir.x;
          pacman.y += pacman.dir.y;
        }

        // Eat
        const tile = map[pacman.y][pacman.x];
        if (tile === 0) {
          map[pacman.y][pacman.x] = 2;
          scoreLocal += 10;
        } else if (tile === 3) {
          map[pacman.y][pacman.x] = 2;
          scoreLocal += 50;
          powerMode = 300; // Frames of vulnerability
        }
        setScore(scoreLocal);

        // --- Ghosts ---
        ghosts.forEach(g => {
          // Simple AI: Move towards pacman if possible, otherwise random valid
          let moves = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
          let validMoves = moves.filter(m => isValid(g.x + m.x, g.y + m.y));
          
          // Don't reverse immediately if possible
          if (validMoves.length > 1) validMoves = validMoves.filter(m => m.x !== -g.dir.x || m.y !== -g.dir.y);
          
          // Pick best move (closest to pacman) or random if power mode
          if (powerMode > 0) {
             g.dir = validMoves[Math.floor(Math.random() * validMoves.length)];
          } else {
             // Basic tracking
             validMoves.sort((a, b) => {
               const distA = Math.hypot((g.x + a.x) - pacman.x, (g.y + a.y) - pacman.y);
               const distB = Math.hypot((g.x + b.x) - pacman.x, (g.y + b.y) - pacman.y);
               return distA - distB;
             });
             g.dir = validMoves[0] || {x:0, y:0};
          }

          g.x += g.dir.x;
          g.y += g.dir.y;
        });

        if (powerMode > 0) powerMode -= 8;
      }

      // 3. Render Entities
      // Pacman
      const pCx = pacman.x * blockSize + blockSize/2;
      const pCy = pacman.y * blockSize + blockSize/2;
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      // Mouth animation
      const angle = Math.atan2(pacman.dir.y, pacman.dir.x);
      const open = 0.2 + Math.sin(frame * 0.3) * 0.2;
      ctx.arc(pCx, pCy, 11, angle + open, angle + (Math.PI*2 - open));
      ctx.lineTo(pCx, pCy);
      ctx.fill();

      // Ghosts
      ghosts.forEach(g => {
        const gCx = g.x * blockSize + blockSize/2;
        const gCy = g.y * blockSize + blockSize/2;
        ctx.fillStyle = powerMode > 0 ? (powerMode < 60 && frame % 10 < 5 ? "#fff" : "#3b82f6") : g.color;
        
        // Classic Ghost Shape
        ctx.beginPath();
        ctx.arc(gCx, gCy - 2, 11, Math.PI, 0);
        ctx.lineTo(gCx + 11, gCy + 11);
        ctx.lineTo(gCx + 4, gCy + 6);
        ctx.lineTo(gCx - 4, gCy + 6);
        ctx.lineTo(gCx - 11, gCy + 11);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(gCx - 4, gCy - 4, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(gCx + 4, gCy - 4, 3, 0, Math.PI*2); ctx.fill();
        
        // Collision
        if (g.x === pacman.x && g.y === pacman.y) {
          if (powerMode > 0) {
            // Eat Ghost (Send home)
            g.x = 9; g.y = 6; scoreLocal += 200;
          } else {
            setGameState("lost");
            cancelAnimationFrame(animId);
          }
        }
      });

      animId = requestAnimationFrame(draw);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") pacman.nextDir = { x: 0, y: -1 };
      if (e.key === "ArrowDown") pacman.nextDir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft") pacman.nextDir = { x: -1, y: 0 };
      if (e.key === "ArrowRight") pacman.nextDir = { x: 1, y: 0 };
    };

    document.addEventListener("keydown", handleKey);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black py-4">
      <div className="flex justify-between w-full max-w-[500px] mb-2 font-mono font-bold text-xl px-4">
        <span className="text-yellow-400">SCORE: {score}</span>
        {gameState === "won" && <span className="text-green-500 animate-bounce">VICTORY!</span>}
        {gameState === "lost" && <span className="text-red-500 animate-pulse">GAME OVER</span>}
      </div>
      
      <div className="relative border-4 border-blue-900 rounded-lg shadow-[0_0_30px_rgba(30,58,138,0.4)] overflow-hidden">
        <canvas ref={canvasRef} className="bg-black block" />
        {gameState !== "playing" && (
           <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
             <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-xl">
               Insert Coin (Restart)
             </button>
           </div>
        )}
      </div>
      
      {/* Mobile Controls */}
      <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
        <div/>
        <ControlButton dir="UP" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowUp'}))} />
        <div/>
        <ControlButton dir="LEFT" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}))} />
        <ControlButton dir="DOWN" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown'}))} />
        <ControlButton dir="RIGHT" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}))} />
      </div>
    </div>
  );
}

function ControlButton({ dir, onClick }: any) {
  return (
    <button onPointerDown={onClick} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center active:bg-yellow-500/50 transition-colors border border-white/20">
      {dir === "UP" && "▲"}
      {dir === "DOWN" && "▼"}
      {dir === "LEFT" && "◀"}
      {dir === "RIGHT" && "▶"}
    </button>
  );
}