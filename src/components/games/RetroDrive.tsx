"use client";
import { useEffect, useRef } from "react";

export default function RetroDrive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let speed = 0;
    let offset = 0;
    let playerX = 0;
    
    const loop = () => {
      speed = 0.5; // Constant cruise speed
      offset += speed;
      
      // Sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0f172a");
      gradient.addColorStop(0.5, "#4c1d95");
      gradient.addColorStop(1, "#c026d3");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
      ctx.fillStyle = "#facc15";
      ctx.fill();

      // Ground (Grid)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      // Perspective Lines
      ctx.strokeStyle = "#c026d3";
      ctx.lineWidth = 2;
      const horizonY = canvas.height / 2;
      
      // Moving Horizontal Lines
      for(let i=0; i<10; i++) {
        const y = horizonY + Math.pow(2, i) * (offset % 1 + 0.5);
        if (y > canvas.height) continue;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical Lines (Converging)
      for(let i=-10; i<=10; i++) {
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 + i * 10, horizonY);
        ctx.lineTo(canvas.width/2 + i * 200, canvas.height);
        ctx.stroke();
      }

      requestAnimationFrame(loop);
    };
    
    loop();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-cover" />
      <div className="absolute bottom-10 text-white font-mono bg-black/50 px-4 py-2 rounded">
        Chill Mode • Infinite Drive
      </div>
    </div>
  );
}