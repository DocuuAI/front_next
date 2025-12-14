"use client";

import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import React from "react";

export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden"
    >
      {/* GLOBAL MOUSE GLOW */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(99,102,241,0.15),
              transparent 45%
            )
          `,
        }}
      />

      {/* PAGE CONTENT */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}