import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Hash } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  tag: string;
  summary: string;
}

export function NewsCard({ news }: { news: NewsItem }) {
  return (
    <GlassCard className="hover:border-cyan-500/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <span className="flex items-center gap-1 text-xs font-mono text-cyan-400 uppercase bg-cyan-500/10 px-2 py-1 rounded">
          <Hash size={12} /> {news.tag}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={12} /> {news.date}
        </span>
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{news.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{news.summary}</p>
    </GlassCard>
  );
}