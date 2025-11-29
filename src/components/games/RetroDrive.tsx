"use client";
import { useEffect, useRef, useState } from "react";

export default function RetroDrive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // --- Game Constants ---
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    let speed = 0;
    let playerX = 0;
    let position = 0;
    let playerZ = null;
    
    // Road Geometry
    const segments: any[] = [];
    const segmentLength = 200;
    const rumbleLength = 3;
    const roadWidth = 2000;
    const lanes = 3;

    // --- Build Road ---
    const addSegment = (curve: number, y: number) => {
      const n = segments.length;
      segments.push({
        index: n,
        p1: { world: { x: 0, y: y, z: n * segmentLength }, camera: {}, screen: {} },
        p2: { world: { x: 0, y: y, z: (n + 1) * segmentLength }, camera: {}, screen: {} },
        curve: curve,
        color: Math.floor(n / rumbleLength) % 2 ? { road: "#333", grass: "#105510", rumble: "#fff" } : { road: "#333", grass: "#0d440d", rumble: "#c00" }
      });
    };

    // Create a track with curves
    for (let i = 0; i < 500; i++) addSegment(0, 0); // Straight
    for (let i = 0; i < 400; i++) addSegment(i % 100 > 50 ? 2 : -2, 0); // S-Curves
    for (let i = 0; i < 500; i++) addSegment(-2, 0); // Long Left
    for (let i = 0; i < 1000; i++) addSegment(0, 0); // Straight

    const trackLength = segments.length * segmentLength;

    // --- Render Functions ---
    const project = (p: any, cameraX: number, cameraY: number, cameraZ: number) => {
      p.camera.x = (p.world.x || 0) - cameraX;
      p.camera.y = (p.world.y || 0) - cameraY;
      p.camera.z = (p.world.z || 0) - cameraZ;
      const scale = 300 / (p.camera.z || 1); // Depth scale
      p.screen.scale = scale;
      p.screen.x = Math.round((width / 2) + (scale * p.camera.x * width / 2));
      p.screen.y = Math.round((height / 2) - (scale * p.camera.y * height / 2));
      p.screen.w = Math.round((scale * roadWidth * width / 2));
    };

    const drawPoly = (c1: string, x1: number, y1: number, w1: number, x2: number, y2: number, w2: number) => {
      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.moveTo(x1 - w1, y1);
      ctx.lineTo(x2 - w2, y2);
      ctx.lineTo(x2 + w2, y2);
      ctx.lineTo(x1 + w1, y1);
      ctx.fill();
    };

    // --- Input Handling ---
    const keys: { [key: string]: boolean } = {};
    const handleDown = (e: KeyboardEvent) => keys[e.key] = true;
    const handleUp = (e: KeyboardEvent) => keys[e.key] = false;
    document.addEventListener("keydown", handleDown);
    document.addEventListener("keyup", handleUp);

    // --- Main Loop ---
    let animationFrame: number;
    const loop = () => {
      // Logic
      if (keys["ArrowUp"]) speed += 100;
      else if (keys["ArrowDown"]) speed -= 100;
      else speed *= 0.98; // Friction

      if (keys["ArrowLeft"] && speed > 0) playerX -= 50;
      if (keys["ArrowRight"] && speed > 0) playerX += 50;

      // Max Speed
      if (speed > 8000) speed = 8000;
      if (speed < 0) speed = 0;

      position += speed;
      while (position >= trackLength) position -= trackLength;
      while (position < 0) position += trackLength;

      setScore(s => s + Math.floor(speed / 1000));

      // Clear Screen
      ctx.fillStyle = "#0f172a"; // Sky
      ctx.fillRect(0, 0, width, height);

      // Render Road
      let startPos = Math.floor(position / segmentLength);
      let cameraH = 1000;
      let maxy = height;
      let dx = 0; 
      let camX = playerX;

      for (let n = startPos; n < startPos + 300; n++) {
        const segment = segments[n % segments.length];
        
        // Loop logic
        let loopedIndex = n >= segments.length ? segments.length * segmentLength : 0;
        segment.p1.world.z = (segment.index * segmentLength) - loopedIndex;
        segment.p2.world.z = ((segment.index + 1) * segmentLength) - loopedIndex;

        // Clip behind camera
        if (segment.p1.world.z < position - (loopedIndex ? 0 : 0)) continue;

        project(segment.p1, playerX - dx, cameraH, position - loopedIndex);
        project(segment.p2, playerX - dx - dx, cameraH, position - loopedIndex);

        dx += segment.curve; 

        if (segment.p1.screen.y >= maxy) continue;
        maxy = segment.p1.screen.y;

        // Draw Grass
        ctx.fillStyle = segment.color.grass;
        ctx.fillRect(0, segment.p1.screen.y, width, segment.p1.screen.y - height); // Simple grass fill

        // Draw Road
        drawPoly(segment.color.rumble, segment.p1.screen.x, segment.p1.screen.y, segment.p1.screen.w * 1.2, segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w * 1.2);
        drawPoly(segment.color.road, segment.p1.screen.x, segment.p1.screen.y, segment.p1.screen.w, segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w);
        
        // Lane Marker
        if ((segment.index / 3) % 2) {
           drawPoly("#fff", segment.p1.screen.x, segment.p1.screen.y, segment.p1.screen.w * 0.02, segment.p2.screen.x, segment.p2.screen.y, segment.p2.screen.w * 0.02);
        }
      }

      // Draw Player Car (Simple Pixel Art)
      const carW = 100;
      const carH = 50;
      const carX = width / 2 - carW / 2;
      const carY = height - 80;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(carX + 10, carY + 40, carW - 20, 10);
      
      // Car Body
      ctx.fillStyle = "#c026d3"; // Purple
      ctx.fillRect(carX, carY, carW, carH);
      ctx.fillStyle = "#a21caf";
      ctx.fillRect(carX, carY + 10, carW, 20); // Bumper
      
      // Lights
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(carX + 5, carY + 15, 20, 10);
      ctx.fillRect(carX + carW - 25, carY + 15, 20, 10);

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleDown);
      document.removeEventListener("keyup", handleUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black relative">
       <canvas ref={canvasRef} className="w-full h-full object-contain max-w-4xl" />
       <div className="absolute top-4 left-4 bg-black/50 p-2 rounded text-cyan-400 font-mono text-xl">
         DISTANCE: {score}m
       </div>
       <div className="absolute bottom-4 text-slate-500 font-mono text-sm">
         Use ARROW KEYS to Drive
       </div>
    </div>
  );
}