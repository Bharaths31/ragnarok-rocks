"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Clock, Hash } from "lucide-react";

export default function NewsPage() {
  const [topics, setTopics] = useState<string[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  // 1. Fetch User Topics
  useEffect(() => {
    const fetchTopics = async () => {
      const snap = await getDocs(collection(db, "news_topics"));
      const topicList = snap.docs.map(d => d.data().topic);
      setTopics(topicList.length > 0 ? topicList : ["Quantum Computing", "Cyber Security", "Indie Games"]);
    };
    fetchTopics();
  }, []);

  // 2. Simulate Fetching News (To avoid API Key issues for now)
  useEffect(() => {
    if (topics.length === 0) return;

    // Simulate API delay
    const timer = setTimeout(() => {
      const mockNews = topics.map((topic, i) => ({
        id: i,
        title: `Breakthrough in ${topic} announced today`,
        description: `Researchers have discovered a new method to optimize ${topic} workflows using AI algorithms.`,
        source: "TechDaily",
        time: "2 hours ago",
        tag: topic,
        image: `https://source.unsplash.com/random/800x600/?${topic.replace(" ", "")},tech`
      }));
      setArticles([...mockNews, ...mockNews]); // Double it for visual volume
    }, 1000);

    return () => clearTimeout(timer);
  }, [topics]);

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
          Global Feed
        </h1>
        
        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {topics.map(t => (
            <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300 font-mono">
              #{t}
            </span>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid gap-6">
          {articles.length === 0 ? (
            <div className="text-center py-20 text-slate-500 animate-pulse">Scanning frequencies...</div>
          ) : (
            articles.map((news, idx) => (
              <article key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1">
                    <Hash size={12}/> {news.tag}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12}/> {news.time}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold mb-3 group-hover:text-pink-400 transition-colors">
                  {news.title}
                </h2>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  {news.description}
                </p>
                <div className="text-xs text-slate-600 font-mono">
                  Source: {news.source} // Read More &rarr;
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}