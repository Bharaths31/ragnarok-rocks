import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Download, Eraser, PenTool, Save, Type, Database } from 'lucide-react';
import initSqlJs from 'sql.js';

const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notepad' | 'drawpad'>('notepad');
  const [noteContent, setNoteContent] = useState('');
  const [dbStatus, setDbStatus] = useState('Initializing DB...');
  const [db, setDb] = useState<any>(null);

  // Initialize SQLite
  useEffect(() => {
    const initDB = async () => {
      try {
        const SQL = await initSqlJs({
          locateFile: (file) => `/${file}`
        });

        // Load existing DB from localStorage if available
        const savedDb = localStorage.getItem('portfolio_notes_db');
        let database;

        if (savedDb) {
           const u8 = new Uint8Array(savedDb.split(',').map(Number));
           database = new SQL.Database(u8);
        } else {
           database = new SQL.Database();
           database.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)");
        }

        setDb(database);
        setDbStatus('Database Ready (SQLite)');

        // Load latest note
        try {
          const res = database.exec("SELECT content FROM notes ORDER BY id DESC LIMIT 1");
          if (res.length > 0 && res[0].values.length > 0) {
            setNoteContent(res[0].values[0][0] as string);
          }
        } catch (e) {
          console.error("Error reading from DB", e);
        }

      } catch (err) {
        console.error(err);
        setDbStatus('Failed to load SQLite');
      }
    };

    initDB();
  }, []);

  const saveNote = () => {
    if (!db) return;
    try {
      db.run("INSERT INTO notes (content) VALUES (?)", [noteContent]);
      // Export to local storage for persistence across reloads
      const data = db.export();
      localStorage.setItem('portfolio_notes_db', data.toString());
      setDbStatus('Note Saved!');
      setTimeout(() => setDbStatus('Database Ready (SQLite)'), 2000);
    } catch (e) {
      console.error(e);
      setDbStatus('Save Failed');
    }
  };

  const exportDB = () => {
     if (!db) return;
     const data = db.export();
     const blob = new Blob([data], { type: 'application/x-sqlite3' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'notes.sqlite';
     a.click();
  };

  // Drawpad logic
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#00f3ff' : '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drawing.png';
    a.click();
  }

  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-8 shiny-text">Creative Tools</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('notepad')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'notepad' ? 'bg-neon-blue text-black font-bold' : 'glass-panel-dark text-white'}`}
        >
          <Type size={20} /> Notepad
        </button>
        <button
          onClick={() => setActiveTab('drawpad')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${activeTab === 'drawpad' ? 'bg-neon-purple text-white font-bold' : 'glass-panel-dark text-white'}`}
        >
          <PenTool size={20} /> Drawpad
        </button>
      </div>

      <div className="glass-panel-dark p-1 rounded-2xl overflow-hidden min-h-[500px]">
        {activeTab === 'notepad' ? (
          <div className="h-full flex flex-col p-6 gap-4">
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <h3 className="text-xl font-bold">Local Secure Notes</h3>
                 <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">{dbStatus}</span>
               </div>
               <div className="flex gap-2">
                 <button onClick={exportDB} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-neon-green hover:text-black transition-colors">
                   <Database size={18} /> Export DB
                 </button>
                 <button onClick={saveNote} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-neon-blue hover:text-black transition-colors">
                   <Save size={18} /> Save
                 </button>
               </div>
             </div>
             <textarea
               value={noteContent}
               onChange={(e) => setNoteContent(e.target.value)}
               className="w-full h-[400px] bg-black/20 p-4 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-neon-blue/50 text-white"
               placeholder="Start typing... (Notes are saved to local SQLite DB)"
             />
          </div>
        ) : (
          <div className="h-full flex flex-col p-6 gap-4">
             <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold">Canvas</h3>
               <div className="flex gap-2">
                 <button onClick={clearCanvas} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                   <Eraser size={18} /> Clear
                 </button>
                 <button onClick={downloadCanvas} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-neon-purple hover:text-white transition-colors">
                   <Download size={18} /> Export PNG
                 </button>
               </div>
             </div>
             <div className="bg-white/90 rounded-xl overflow-hidden cursor-crosshair h-[400px]">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tools;
