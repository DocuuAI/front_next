"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "0%",
    label: "Missed Deadlines",
    glow: "rgba(59,130,246,0.6)",
  },
  {
    value: "10×",
    label: "Faster Processing",
    glow: "rgba(34,197,94,0.6)",
  },
  {
    value: "100%",
    label: "Encrypted",
    glow: "rgba(168,85,247,0.6)",
  },
  {
    value: "24/7",
    label: "AI Active",
    glow: "rgba(245,158,11,0.6)",
  },
];

export function StatCard() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 perspective-[1400px]">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ rotateX: -12, rotateY: 14, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="group relative rounded-2xl bg-white/5 border border-white/10
              p-8 text-center [transform-style:preserve-3d]"
              style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
              onHoverStart={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 90px ${stat.glow}`;
              }}
              onHoverEnd={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  "0 0 0 rgba(0,0,0,0)";
              }}
            >
              {/* hover glow only */}
              <div
                className="pointer-events-none absolute inset-[-40%] rounded-full blur-[140px]
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: stat.glow }}
              />

              {/* content */}
              <div className="relative z-10 space-y-3">
                <div className="text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm tracking-wide text-zinc-400">
                  {stat.label}
                </div>
              </div>

              {/* edge highlight */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}