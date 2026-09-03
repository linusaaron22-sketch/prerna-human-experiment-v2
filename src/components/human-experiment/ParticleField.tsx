"use client";

import { motion } from "framer-motion";

const particles = [
  [8, 18, 2, 0.2], [17, 72, 1, 0.8], [27, 31, 1, 1.6], [38, 82, 2, 1.1],
  [49, 17, 1, 2.4], [61, 68, 1, 0.5], [73, 25, 2, 1.9], [82, 78, 1, 2.8],
  [91, 44, 1, 1.3], [13, 45, 1, 3.2], [55, 42, 1, 3.8], [68, 89, 1, 2.1]
] as const;

export default function ParticleField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map(([left, top, size, delay], index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-cyan-100/50 shadow-[0_0_18px_rgba(103,232,249,0.32)]"
          style={{ left: `${left}%`, top: `${top}%`, width: size * 2, height: size * 2 }}
          animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{ duration: 5 + (index % 4), repeat: Infinity, ease: "easeInOut", delay }}
        />
      ))}
      <div className="absolute left-1/2 top-[38%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-400/[0.035] blur-3xl" />
      <div className="absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-violet-500/[0.06] blur-3xl" />
    </div>
  );
}
