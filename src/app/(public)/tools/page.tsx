"use client";
import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Save, Eraser, PenTool, Type, Download, Bold, Italic, Underline, Palette, Undo, FileDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<"notepad" | "drawpad">("drawpad");

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Tool Switcher */}
        <div className="flex gap-4 mb-4 justify-center">
          <button 
            onClick={() => setActiveTool("notepad")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${activeTool === "notepad" ? "bg-cyan-600 border-cyan-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <Type size={18} /> Secure Notes
          </button>
          <button 
            onClick={() => setActiveTool("drawpad")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full border transition-all ${activeTool === "drawpad" ? "bg-purple-600 border-purple-500" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
          >
            <PenTool size={18} /> Whiteboard
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#111] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
          {activeTool === "notepad" ? <Notepad /> : <Drawpad />}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* NOTEPAD                                   */
/* -------------------------------------------------------------------------- */
function Notepad() {
  const [text, setText] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("secure_notes");
    if (saved) setText(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    localStorage.setItem("secure_notes", e.target.value);
  };

  const insertFormat = (char: string) => {
    // Simple markdown-style insertion for this lightweight version
    if (!editorRef.current) return;
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const val = editorRef.current.value;
    const before = val.substring(0, start);
    const sel = val.substring(start, end);
    const after = val.substring(end);
    
    // Toggle format logic could be complex, doing simple wrap here
    const newVal = `${before}${char}${sel}${char}${after}`;
    setText(newVal);
    localStorage.setItem("secure_notes", newVal);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("courier");
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 10);
    doc.save("secure-notes.pdf");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Toolbar */}
      <div className="p-2 flex justify-between items-center border-b border-white/10 bg-[#222]">
        <div className="flex gap-2">
           <button onClick={() => insertFormat("**")} className="p-2 hover:bg-white/10 rounded text-slate-300" title="Bold"><Bold size={16}/></button>
           <button onClick={() => insertFormat("*")} className="p-2 hover:bg-white/10 rounded text-slate-300" title="Italic"><Italic size={16}/></button>
           <button onClick={() => insertFormat("__")} className="p-2 hover:bg-white/10 rounded text-slate-300" title="Underline"><Underline size={16}/></button>
        </div>
        <button onClick={downloadPDF} className="flex items-center gap-2 text-xs bg-cyan-600 px-3 py-1.5 rounded text-white hover:bg-cyan-500 font-bold">
          <Download size={14} /> PDF
        </button>
      </div>
      <textarea 
        ref={editorRef}
        className="flex-1 bg-transparent p-6 text-emerald-400 font-mono resize-none focus:outline-none text-lg leading-relaxed"
        value={text}
        onChange={handleChange}
        placeholder="// Enter classified data..."
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DRAWPAD                                   */
/* -------------------------------------------------------------------------- */
function Drawpad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#a855f7"); // Default purple
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  // Resize Logic
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        // Save current content
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx?.drawImage(canvas, 0, 0);

        // Resize
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Restore content
        const ctx = canvas.getContext("2d");
        if (ctx) {
           ctx.drawImage(tempCanvas, 0, 0);
           ctx.lineCap = "round";
           ctx.lineJoin = "round";
           ctx.strokeStyle = color;
           ctx.lineWidth = brushSize;
        }
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update context when color/size changes
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
  }, [color, brushSize]);

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
      return {
        offsetX: e.touches[0].clientX - (rect?.left || 0),
        offsetY: e.touches[0].clientY - (rect?.top || 0)
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = (format: "png" | "pdf") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (format === "png") {
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape" });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`whiteboard-${Date.now()}.pdf`);
    }
    setShowSaveMenu(false);
  };

  const colors = ["#ffffff", "#000000", "#ef4444", "#22c55e", "#3b82f6"];

  return (
    <div ref={containerRef} className="flex h-full w-full bg-[#0f0f0f] relative group">
      
      {/* Left Sidebar (Color Picker) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 p-3 bg-[#1a1a1a]/90 backdrop-blur border border-white/10 rounded-2xl shadow-xl z-20">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
            style={{ backgroundColor: c }}
          />
        ))}
        <div className="w-full h-[1px] bg-white/10 my-1" />
        
        {/* Custom Color Wheel */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 cursor-pointer hover:border-white transition-colors">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="absolute -top-2 -left-2 w-12 h-12 p-0 border-0 cursor-pointer"
          />
          <Palette size={16} className="absolute inset-0 m-auto text-white/50 pointer-events-none" />
        </div>
        
        <div className="w-full h-[1px] bg-white/10 my-1" />
        <button onClick={clearCanvas} className="text-red-400 hover:bg-white/5 p-2 rounded-lg" title="Clear"><Eraser size={20}/></button>
      </div>

      {/* Top Right Save Menu */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <div className="relative">
            <button 
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
            >
              <Save size={18} /> Save
            </button>
            
            <AnimatePresence>
              {showSaveMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 bg-[#222] border border-white/10 rounded-xl p-2 w-32 flex flex-col gap-1 shadow-xl"
                >
                  <button onClick={() => saveImage("png")} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-sm text-slate-300"><FileDown size={14}/> PNG Image</button>
                  <button onClick={() => saveImage("pdf")} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded text-sm text-slate-300"><FileDown size={14}/> PDF File</button>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-crosshair touch-none"
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