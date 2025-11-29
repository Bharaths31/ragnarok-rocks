"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on Home Page or Login Page
  if (pathname === "/" || pathname === "/admin/login") return null;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={() => router.push("/")}
      className="fixed top-6 left-6 z-50 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-slate-300 hover:text-white hover:border-cyan-500 transition-all group"
    >
      <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
    </motion.button>
  );
}