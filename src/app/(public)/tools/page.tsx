"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Save, Download, Eraser, PenTool, Type } from "lucide-react";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"notepad" | "drawpad">("notepad");

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Tool Switcher */}
        <div className="flex gap-4 mb-8 justify-center">
          <button 
            onClick={() => setActiveTool("notepad")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${activeTool === "notepad" ? "bg-cyan-600 border-cyan-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <Type size={18} /> Secure Notes
          </button>
          <button 
            onClick={() => setActiveTool("drawpad")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${activeTool === "drawpad" ? "bg-purple-600 border-purple-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <PenTool size={18} /> Whiteboard
          </button>
        </div>

        {/* Content Area */}
        <div className="w-full h-[70vh] bg-[#111] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
          {activeTool === "notepad" ? <Notepad /> : <Drawpad />}
        </div>
      </div>
    </div>
  );
}

function Notepad() {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("secure_notes");
    if (saved) setText(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    localStorage.setItem("secure_notes", e.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save("secure-notes.pdf");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#1a1a1a] p-3 flex justify-between items-center border-b border-white/10">
        <span className="text-xs text-slate-500 font-mono">LOCAL_STORAGE_ACTIVE</span>
        <button onClick={downloadPDF} className="flex items-center gap-2 text-xs bg-cyan-600 px-3 py-1.5 rounded text-white hover:bg-cyan-500">
          <Download size={14} /> Export PDF
        </button>
      </div>
      <textarea 
        className="flex-1 bg-transparent p-6 text-emerald-400 font-mono resize-none focus:outline-none"
        value={text}
        onChange={handleChange}
        placeholder="// Type classified info here..."
      />
    </div>
  );
}

function Drawpad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 1. Responsive Resize Logic
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        // Set actual pixel density to match screen size (prevents blur)
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Re-setup context after resize
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.strokeStyle = "#a855f7"; // Purple default
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      // Handle Touch vs Mouse
      const clientX = 'touches' in e ? e.touches[0].clientX : e.nativeEvent.offsetX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.nativeEvent.offsetY;
      
      // Adjustment for offset if using Touch (Mouse offsetX handles it automatically)
      if ('touches' in e) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) ctx.moveTo(clientX - rect.left, clientY - rect.top);
      } else {
        ctx.moveTo(clientX, clientY);
      }
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      // Handle Touch vs Mouse
      const clientX = 'touches' in e ? e.touches[0].clientX : e.nativeEvent.offsetX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.nativeEvent.offsetY;

      if ('touches' in e) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) ctx.lineTo(clientX - rect.left, clientY - rect.top);
      } else {
        ctx.lineTo(clientX, clientY);
      }
      ctx.stroke();
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full relative w-full bg-[#0f0f0f]">
       <div className="absolute top-4 left-4 z-10 bg-[#1a1a1a]/90 backdrop-blur p-2 rounded-lg border border-white/10 flex gap-2">
         <button onClick={clear} className="p-2 hover:bg-white/10 rounded text-red-400"><Eraser size={20}/></button>
       </div>
       <canvas 
         ref={canvasRef}
         className="w-full h-full cursor-crosshair touch-none" // touch-none prevents scrolling while drawing
         onMouseDown={startDraw}
         onMouseMove={draw}
         onMouseUp={() => setIsDrawing(false)}
         onMouseLeave={() => setIsDrawing(false)}
         onTouchStart={startDraw}
         onTouchMove={draw}
         onTouchEnd={() => setIsDrawing(false)}
       />
    </div>
  );
}