"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Save, Eraser, PenTool, Type, Download, Bold, Italic, Underline, Trash2, Menu, X } from "lucide-react";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"notepad" | "drawpad">("drawpad");

  return (
    <div className="min-h-screen bg-black text-white pt-20 md:pt-24 flex flex-col items-center overflow-hidden fixed inset-0">
      <div className="w-full max-w-7xl h-full flex flex-col px-2 pb-2 md:px-4 md:pb-4">
        
        {/* Responsive Toggle Switcher */}
        <div className="flex shrink-0 gap-2 md:gap-6 mb-2 md:mb-4 justify-center bg-zinc-900/80 p-1.5 rounded-full border border-white/10 w-fit mx-auto backdrop-blur-md z-50">
          <button 
            onClick={() => setActiveTool("notepad")}
            className={`flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 rounded-full border transition-all duration-300 text-sm md:text-base font-bold ${
              activeTool === "notepad" 
                ? "bg-cyan-600 border-cyan-400 text-white shadow-[0_0_20px_rgba(8,145,178,0.6)]" 
                : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Type size={16} className="md:w-5 md:h-5" /> <span className="hidden md:inline">Secure</span> Notes
          </button>
          
          <button 
            onClick={() => setActiveTool("drawpad")}
            className={`flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 rounded-full border transition-all duration-300 text-sm md:text-base font-bold ${
              activeTool === "drawpad" 
                ? "bg-purple-600 border-purple-400 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)]" 
                : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <PenTool size={16} className="md:w-5 md:h-5" /> Whiteboard
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#111] border border-white/10 rounded-xl md:rounded-3xl overflow-hidden relative shadow-2xl">
          {activeTool === "notepad" ? <RichNotepad /> : <Drawpad />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RICH TEXT NOTEPAD                                                         */
/* -------------------------------------------------------------------------- */
function RichNotepad() {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("secure_notes_html");
    if (saved && editorRef.current) editorRef.current.innerHTML = saved;
  }, []);

  const handleInput = () => {
    if (editorRef.current) localStorage.setItem("secure_notes_html", editorRef.current.innerHTML);
  };

  const formatDoc = (cmd: string) => {
    document.execCommand(cmd, false);
    editorRef.current?.focus();
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const text = editorRef.current?.innerText || "";
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save("notes.pdf");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      <div className="p-2 md:p-3 flex justify-between items-center border-b border-white/10 bg-[#222]">
        <div className="flex gap-1 md:gap-2">
           <FormatBtn icon={<Bold size={18}/>} onClick={() => formatDoc('bold')} />
           <FormatBtn icon={<Italic size={18}/>} onClick={() => formatDoc('italic')} />
           <FormatBtn icon={<Underline size={18}/>} onClick={() => formatDoc('underline')} />
        </div>
        <button onClick={downloadPDF} className="flex items-center gap-2 text-xs bg-cyan-600 hover:bg-cyan-500 px-3 py-2 rounded-lg text-white font-bold transition-all">
          <Download size={14} /> <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>
      
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 bg-transparent p-4 md:p-8 text-emerald-400 font-mono text-base md:text-lg outline-none overflow-y-auto leading-relaxed"
      />
    </div>
  );
}

function FormatBtn({ icon, onClick }: any) {
  return (
    <button onClick={onClick} className="p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
      {icon}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* DRAWPAD (Responsive & Optimized)                                          */
/* -------------------------------------------------------------------------- */
function Drawpad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#a855f7"); 
  const [brushSize, setBrushSize] = useState(3);
  const [eraserSize, setEraserSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeToolMode, setActiveToolMode] = useState<"brush" | "eraser">("brush");
  const [menuOpen, setMenuOpen] = useState(false); // Mobile Menu Toggle

  // Resize Logic
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
        tempCtx?.drawImage(canvas, 0, 0);
        
        canvas.width = container.offsetWidth; 
        canvas.height = container.offsetHeight;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
           ctx.drawImage(tempCanvas, 0, 0);
           ctx.lineCap = "round";
           ctx.lineJoin = "round";
        }
      }
    };
    window.addEventListener("resize", handleResize);
    // Slight delay to allow flexbox to settle
    setTimeout(handleResize, 100);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update Context
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      if (activeToolMode === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = eraserSize;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
      }
    }
  }, [color, brushSize, eraserSize, activeToolMode]);

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
    if(confirm("Clear board?")) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if(canvas) {
       const link = document.createElement('a');
       link.download = `whiteboard-${Date.now()}.png`;
       link.href = canvas.toDataURL();
       link.click();
    }
  };

  const colors = ["#ffffff", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

  return (
    <div ref={containerRef} className="flex h-full w-full bg-[#0f0f0f] relative group touch-none">
      
      {/* Mobile Menu Toggle */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden absolute top-4 left-4 z-30 bg-zinc-800 p-2 rounded-lg border border-white/10 text-white shadow-xl">
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Toolbar (Responsive) */}
      <div className={`absolute top-0 left-0 h-full md:h-auto md:top-1/2 md:-translate-y-1/2 md:left-4 flex flex-col gap-4 p-4 bg-[#18181b]/95 backdrop-blur-xl border-r md:border border-white/10 md:rounded-2xl shadow-2xl z-20 w-16 items-center transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* Color Palette */}
        <div className={`flex flex-col gap-2 transition-opacity duration-300 ${activeToolMode === 'eraser' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {colors.map((c) => (
            <button 
              key={c} onClick={() => setColor(c)} 
              className={`w-6 h-6 rounded-full border-2 transition-transform duration-200 ${color === c ? "border-white scale-125 shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "border-transparent hover:scale-110"}`} 
              style={{ backgroundColor: c }} 
            />
          ))}
        </div>
        
        <div className="w-full h-[1px] bg-white/10" />

        {/* Tools */}
        <ToolBtn icon={<PenTool size={20}/>} active={activeToolMode === "brush"} onClick={() => setActiveToolMode("brush")} color="purple" />
        <ToolBtn icon={<Eraser size={20}/>} active={activeToolMode === "eraser"} onClick={() => setActiveToolMode("eraser")} color="red" />

        {/* Slider */}
        <div className="relative py-2 h-24 flex items-center justify-center">
           <input 
             type="range" 
             min={activeToolMode === 'eraser' ? "10" : "1"} 
             max={activeToolMode === 'eraser' ? "100" : "20"} 
             value={activeToolMode === 'eraser' ? eraserSize : brushSize} 
             onChange={(e) => activeToolMode === 'eraser' ? setEraserSize(Number(e.target.value)) : setBrushSize(Number(e.target.value))} 
             className={`h-20 w-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none slider-vertical`}
             style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
           />
        </div>

        <div className="w-full h-[1px] bg-white/10" />
        <button onClick={clearCanvas} className="text-slate-500 hover:text-red-400 p-2"><Trash2 size={20}/></button>
      </div>

      <div className="absolute top-4 right-4 z-20">
         <button onClick={saveImage} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm md:text-base"><Save size={18} /> <span className="hidden sm:inline">Save</span></button>
      </div>

      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
        onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
      />
    </div>
  );
}

function ToolBtn({ icon, active, onClick, color }: any) {
  const activeClass = color === "red" 
    ? "bg-red-500/20 text-red-400 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]" 
    : "bg-purple-600/20 text-purple-400 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]";
    
  return (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all duration-300 border-2 ${active ? activeClass : "text-slate-500 border-transparent hover:bg-white/5"}`}>
      {icon}
    </button>
  );
}