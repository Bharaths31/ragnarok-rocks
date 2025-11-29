"use client";
import { useEffect, useRef, useState } from "react";

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1;
    let dy = 0;
    let interval: NodeJS.Timeout;

    const draw = () => {
      // Logic update
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      
      if (head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 30 || snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = { x: Math.floor(Math.random() * 40), y: Math.floor(Math.random() * 30) };
      } else {
        snake.pop();
      }

      // Render
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#22d3ee";
      snake.forEach(s => ctx.fillRect(s.x * gridSize, s.y * gridSize, gridSize - 2, gridSize - 2));

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
      if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
      if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
      if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
    };

    document.addEventListener("keydown", handleKey);
    interval = setInterval(draw, 100);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKey);
    };
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <div className="mb-4 text-2xl font-mono">SCORE: {score}</div>
      <canvas ref={canvasRef} width={800} height={600} className="bg-black border border-white/20 rounded-lg max-w-full" />
      {gameOver && <button onClick={() => window.location.reload()} className="mt-4 bg-cyan-600 px-6 py-2 rounded text-white font-bold">Restart</button>}
      <p className="mt-4 text-slate-500">Use Arrow Keys to move</p>
    </div>
  );
}