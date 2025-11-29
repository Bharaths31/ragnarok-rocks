"use client";
import { useEffect, useRef, useState } from "react";

const MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]; // 1 = Wall, 0 = Dot

export default function PacMan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const blockSize = 30;
    const rows = MAP.length;
    const cols = MAP[0].length;
    canvas.width = cols * blockSize;
    canvas.height = rows * blockSize;

    // Game State
    let dots = JSON.parse(JSON.stringify(MAP)); // Deep copy map
    let pacman = { x: 9, y: 7, dir: { x: 0, y: 0 }, nextDir: { x: 0, y: 0 } };
    let ghost = { x: 1, y: 1, color: "red" };
    let frame = 0;
    let mouthOpen = 0;
    let localScore = 0;
    let animationFrame: number;

    const draw = () => {
      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Map
      let dotsRemaining = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (MAP[r][c] === 1) {
            ctx.fillStyle = "#1e3a8a"; // Wall Blue
            ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
            // Inner line for style
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 1;
            ctx.strokeRect(c * blockSize + 4, r * blockSize + 4, blockSize - 8, blockSize - 8);
          } else if (dots[r][c] === 0) {
            dotsRemaining++;
            ctx.fillStyle = "#fbbf24"; // Dot
            ctx.beginPath();
            ctx.arc(c * blockSize + blockSize/2, r * blockSize + blockSize/2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if(dotsRemaining === 0) {
        setWin(true);
        cancelAnimationFrame(animationFrame);
        return;
      }

      // Move Pacman (Simple Grid Movement)
      frame++;
      if (frame % 10 === 0) { // Slow down movement
        const nextX = pacman.x + pacman.nextDir.x;
        const nextY = pacman.y + pacman.nextDir.y;
        
        // Try next direction
        if (MAP[nextY] && MAP[nextY][nextX] !== 1) {
          pacman.dir = pacman.nextDir;
        }

        const moveX = pacman.x + pacman.dir.x;
        const moveY = pacman.y + pacman.dir.y;

        if (MAP[moveY] && MAP[moveY][moveX] !== 1) {
          pacman.x = moveX;
          pacman.y = moveY;
        }

        // Eat Dot
        if (dots[pacman.y][pacman.x] === 0) {
          dots[pacman.y][pacman.x] = 2; // Empty
          localScore += 10;
          setScore(localScore);
        }

        // Move Ghost (Random Dumb AI)
        const ghostDirs = [{x:0, y:1}, {x:0, y:-1}, {x:1, y:0}, {x:-1, y:0}];
        const validGhostMoves = ghostDirs.filter(d => MAP[ghost.y + d.y] && MAP[ghost.y + d.y][ghost.x + d.x] !== 1);
        if (validGhostMoves.length > 0) {
           const move = validGhostMoves[Math.floor(Math.random() * validGhostMoves.length)];
           ghost.x += move.x;
           ghost.y += move.y;
        }
      }

      // Draw Pacman
      const px = pacman.x * blockSize + blockSize/2;
      const py = pacman.y * blockSize + blockSize/2;
      mouthOpen = (mouthOpen + 1) % 10;
      
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      // Simple logic to rotate mouth based on direction could go here
      ctx.arc(px, py, 12, mouthOpen < 5 ? 0.2 : 0, mouthOpen < 5 ? 1.8 * Math.PI : 2 * Math.PI);
      ctx.fill();

      // Draw Ghost
      const gx = ghost.x * blockSize + blockSize/2;
      const gy = ghost.y * blockSize + blockSize/2;
      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.arc(gx, gy - 2, 12, Math.PI, 0);
      ctx.lineTo(gx + 12, gy + 12);
      ctx.lineTo(gx - 12, gy + 12);
      ctx.fill();

      // Collision
      if (pacman.x === ghost.x && pacman.y === ghost.y) {
        setGameOver(true);
        cancelAnimationFrame(animationFrame);
        return;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    // Input
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") pacman.nextDir = { x: 0, y: -1 };
      if (e.key === "ArrowDown") pacman.nextDir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft") pacman.nextDir = { x: -1, y: 0 };
      if (e.key === "ArrowRight") pacman.nextDir = { x: 1, y: 0 };
    };

    document.addEventListener("keydown", handleKey);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full py-10 bg-black">
      <div className="flex justify-between w-[570px] mb-4 text-xl font-bold font-mono">
         <span className="text-yellow-400">SCORE: {score}</span>
         {gameOver && <span className="text-red-500 animate-pulse">GAME OVER</span>}
         {win && <span className="text-green-500 animate-bounce">YOU WIN!</span>}
      </div>
      <canvas ref={canvasRef} className="bg-black border-4 border-blue-900 rounded-lg shadow-2xl shadow-blue-900/20" />
      <p className="mt-4 text-slate-500 text-sm">Use Arrow Keys</p>
      {(gameOver || win) && <button onClick={() => window.location.reload()} className="mt-4 bg-yellow-500 text-black px-6 py-2 rounded font-bold">Try Again</button>}
    </div>
  );
}