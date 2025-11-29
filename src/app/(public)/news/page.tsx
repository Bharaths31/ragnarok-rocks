"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Clock, ExternalLink, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const snap = await getDocs(collection(db, "news_topics"));
        const topicList = snap.docs.map(d => d.data().topic);
        setTopics(topicList.length > 0 ? topicList : ["Technology"]);
      } catch (e) {
        setTopics(["Technology"]);
      }
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics.length === 0) return;

    const fetchNews = async () => {
      setLoading(true);
      setError("");
      try {
        const topicString = topics.join(",");
        const res = await fetch(`/api/news?topics=${encodeURIComponent(topicString)}&limit=${limit}`);
        
        // 1. Get raw text first to check for HTML errors
        const text = await res.text();

        try {
          // 2. Try to parse JSON
          const data = JSON.parse(text);
          if (data.articles) {
            setArticles(data.articles);
          } else {
            console.error("API Error:", data);
            setError("API limit reached or Key invalid.");
          }
        } catch (jsonError) {
          // 3. If JSON fails, it means we got HTML (Error Page)
          console.error("Server returned HTML instead of JSON:", text);
          setError("Server Error: Check console for HTML response.");
        }

      } catch (error) {
        console.error("Network Error", error);
        setError("Failed to connect to News Service.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => fetchNews(), 500);
    return () => clearTimeout(timer);
  }, [topics, limit]);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500 mb-2">
              Global Feed
            </h1>
            <p className="text-slate-400 text-sm">
              Live updates on: <span className="text-pink-400 font-mono">{topics.join(", ")}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0 bg-white/5 p-1 rounded-lg border border-white/10">
            <span className="text-xs text-slate-500 px-2 font-bold uppercase">Show:</span>
            {[10, 20, 30, 40].map((num) => (
              <button
                key={num}
                onClick={() => setLimit(num)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  limit === num 
                    ? "bg-pink-600 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl mb-8 flex items-center gap-4 text-red-200">
            <AlertTriangle size={24} />
            <div>
              <h3 className="font-bold">System Failure</h3>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Loading & Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-pink-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-sm font-mono animate-pulse">Scanning Satellite Feeds...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {articles.map((news, idx) => (
                <motion.a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={`${news.title}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] transition-all flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative">
                    {news.image ? (
                      <img 
                        src={news.image} 
                        alt="News" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center text-slate-700">
                        <RefreshCw size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-pink-400 text-[10px] font-bold px-2 py-1 rounded uppercase border border-pink-500/30">
                      {news.source.name}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12}/> {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-3 text-slate-200 group-hover:text-pink-400 transition-colors line-clamp-2">
                      {news.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {news.description}
                    </p>
                    <div className="pt-4 border-t border-white/5 flex justify-end">
                      <span className="text-xs font-bold text-pink-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Full Article <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}