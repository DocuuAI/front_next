"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ----------------------------------
   MAIN CARD (3D + Glow)
---------------------------------- */
interface Props {
  children: React.ReactNode;
}
const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 150, damping: 20 });
    const springY = useSpring(y, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(springY, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const dx = e.clientX - rect.left;
      const dy = e.clientY - rect.top;

      x.set(dx / rect.width - 0.5);
      y.set(dy / rect.height - 0.5);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className={cn(
          "relative rounded-xl border bg-card text-card-foreground shadow-lg",
          "will-change-transform",
          className
        )}
        {...props}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/25 via-purple-500/10 to-transparent" />

        {/* Content */}
        {React.Children.map(children, (child, index) => (
        <div key={index} className="relative z-10">
          {child}
        </div>
      ))}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

/* ----------------------------------
   SUB COMPONENTS
---------------------------------- */

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight translate-z-20", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground translate-z-10", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 translate-z-10", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0 translate-z-10", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};