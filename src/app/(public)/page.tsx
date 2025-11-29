"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Save, Eraser, PenTool, Type, Download, Bold, Italic, Underline, Palette, FileDown, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"notepad" | "drawpad">("drawpad");

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Tool Switcher */}
        <div className="flex gap-4 mb-4 justify-center">
          <button onClick={() => setActiveTool("notepad")} className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${activeTool === "notepad" ? "bg-cyan-600 border-cyan-500" : "bg-white/5 border-white/10"}`}>
            <Type size={18} /> Secure Notes
          </button>
          <button onClick={() => setActiveTool("drawpad")} className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${activeTool === "drawpad" ? "bg-purple-600 border-purple-500" : "bg-white/5 border-white/10"}`}>
            <PenTool size={18} /> Whiteboard
          </button>
        </div>

        <div className="flex-1 bg-[#111] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
          {activeTool === "notepad" ? <RichNotepad /> : <Drawpad />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RICH TEXT NOTEPAD (No Asterisks!)             */
/* -------------------------------------------------------------------------- */
function RichNotepad() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("secure_notes_html");
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      localStorage.setItem("secure_notes_html", editorRef.current.innerHTML);
    }
  };

  const formatDoc = (cmd: string) => {
    document.execCommand(cmd, false); // Native browser rich text command
    editorRef.current?.focus();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    // Strip HTML for simple PDF export or use html2canvas for full fidelity
    // Simple text extraction:
    const text = editorRef.current?.innerText || "";
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save("notes.pdf");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Toolbar */}
      <div className="p-2 flex justify-between items-center border-b border-white/10 bg-[#222]">
        <div className="flex gap-1">
           <button onClick={() => formatDoc('bold')} className="p-2 hover:bg-white/10 rounded text-slate-300 font-bold" title="Bold"><Bold size={16}/></button>
           <button onClick={() => formatDoc('italic')} className="p-2 hover:bg-white/10 rounded text-slate-300 italic" title="Italic"><Italic size={16}/></button>
           <button onClick={() => formatDoc('underline')} className="p-2 hover:bg-white/10 rounded text-slate-300 underline" title="Underline"><Underline size={16}/></button>
        </div>
        <button onClick={downloadPDF} className="flex items-center gap-2 text-xs bg-cyan-600 px-3 py-1.5 rounded text-white font-bold"><Download size={14} /> PDF</button>
      </div>
      
      {/* Editable Div */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 bg-transparent p-6 text-emerald-400 font-mono text-lg outline-none overflow-y-auto"
        style={{ minHeight: "100%" }} 
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DRAWPAD (With Eraser Size)                    */
/* -------------------------------------------------------------------------- */
function Drawpad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#a855f7"); 
  const [brushSize, setBrushSize] = useState(3);
  const [eraserSize, setEraserSize] = useState(20); // New State
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false); // Toggle
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  useEffect(() => {
    // Resize Logic (Same as before)
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
        tempCtx?.drawImage(canvas, 0, 0);
        canvas.width = container.offsetWidth; canvas.height = container.offsetHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(tempCanvas, 0, 0);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update Context
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (isEraserMode) {
        ctx.globalCompositeOperation = "destination-out"; // Erase
        ctx.lineWidth = eraserSize;
      } else {
        ctx.globalCompositeOperation = "source-over"; // Draw
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    }
  }, [color, brushSize, eraserSize, isEraserMode]);

  const startDraw = (e: any) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { offsetX, offsetY } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { offsetX, offsetY } = getCoords(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const getCoords = (e: any) => {
    if (e.touches && e.touches[0]) {
      const rect = canvasRef.current?.getBoundingClientRect();
      return { offsetX: e.touches[0].clientX - (rect?.left || 0), offsetY: e.touches[0].clientY - (rect?.top || 0) };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if(canvas) {
       const link = document.createElement('a');
       link.download = `whiteboard-${Date.now()}.png`;
       link.href = canvas.toDataURL();
       link.click();
    }
    setShowSaveMenu(false);
  };

  return (
    <div ref={containerRef} className="flex h-full w-full bg-[#0f0f0f] relative group">
      
      {/* Left Sidebar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 bg-[#1a1a1a]/90 backdrop-blur border border-white/10 rounded-2xl z-20">
        
        {/* Colors */}
        {!isEraserMode && ["#ffffff", "#ef4444", "#22c55e", "#3b82f6", "#a855f7"].map((c) => (
          <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 ${color === c ? "border-white scale-125" : "border-transparent"}`} style={{ backgroundColor: c }} />
        ))}
        
        <div className="w-full h-[1px] bg-white/10" />

        {/* Eraser Toggle */}
        <button onClick={() => setIsEraserMode(!isEraserMode)} className={`p-2 rounded-lg transition-colors ${isEraserMode ? "bg-red-500 text-white" : "text-slate-400 hover:bg-white/10"}`} title="Eraser">
          <Eraser size={20} />
        </button>

        {/* Sliders */}
        {isEraserMode ? (
           <div className="flex flex-col items-center">
             <label className="text-[10px] text-slate-400 mb-1">Size</label>
             <input type="range" min="10" max="100" value={eraserSize} onChange={(e) => setEraserSize(Number(e.target.value))} className="h-24 w-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
           </div>
        ) : (
           <div className="flex flex-col items-center">
             <label className="text-[10px] text-slate-400 mb-1">Brush</label>
             <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="h-24 w-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
           </div>
        )}

        <div className="w-full h-[1px] bg-white/10" />
        <button onClick={clearCanvas} className="text-red-400 hover:bg-white/5 p-2" title="Clear All"><Trash2 size={20}/></button>
      </div>

      {/* Save Button */}
      <div className="absolute top-4 right-4 z-20">
         <button onClick={saveImage} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg"><Save size={18} /> Save PNG</button>
      </div>

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
      />
    </div>
  );
}