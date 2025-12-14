"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Meteors = ({
  number = 8,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: number }).map((_, i) => (
        <motion.span
          key={i}
          initial={{
            x: "120%",
            y: "-30%",
            opacity: 0,
          }}
          animate={{
            x: "-120%",
            y: "120%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.8,
            delay: i * 0.6,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear",
          }}
          className={cn(
            "pointer-events-none absolute top-0 right-0",
            "h-[2px] w-[140px]",
            "bg-gradient-to-l from-sky-400 via-blue-500 to-transparent",
            "rotate-[-35deg]",
            className
          )}
        />
      ))}
    </div>
  );
};