"use client";
import { motion, HTMLMotionProps } from "framer-motion";

// CHANGE 1: Extend HTMLMotionProps instead of ButtonHTMLAttributes
interface NeonButtonProps extends HTMLMotionProps<"button"> {
  variant?: "cyan" | "purple";
}

export function NeonButton({ children, variant = "cyan", className = "", ...props }: NeonButtonProps) {
  const colors = variant === "cyan" 
    ? "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
    : "bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-6 py-3 rounded-xl font-bold text-white transition-all ${colors} ${className}`}
      {...props} // Now TypeScript knows these props are safe for motion.button
    >
      {children}
    </motion.button>
  );
}