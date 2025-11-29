"use client";
import { LogOut, LayoutDashboard, FolderKanban, Rss, BookOpen } from "lucide-react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export function AdminSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  const navItems = [
    { id: "handles", label: "Handles", icon: <LayoutDashboard size={18} /> },
    { id: "projects", label: "Projects", icon: <FolderKanban size={18} /> },
    { id: "news", label: "News Feed", icon: <Rss size={18} /> },
    { id: "guides", label: "Guides", icon: <BookOpen size={18} /> },
  ];

  return (
    <aside className="w-64 bg-black/50 border-r border-white/10 p-6 flex flex-col h-full backdrop-blur-md">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Admin Nexus
        </h2>
        <p className="text-xs text-slate-500">v1.0.0 Secure Mode</p>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              activeTab === item.id
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto"
      >
        <LogOut size={18} />
        Disconnect
      </button>
    </aside>
  );
}