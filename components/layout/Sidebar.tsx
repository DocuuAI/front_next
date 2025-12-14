"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";

import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  Users,
  MessageSquare,
  Bell,
  Settings,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------ Navigation Items ------------------ */

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Upload, label: "Upload", path: "/app/upload" },
  { icon: FolderOpen, label: "Library", path: "/app/library" },
  { icon: Users, label: "Entities", path: "/app/entities" },
  { icon: MessageSquare, label: "AI Assistant", path: "/app/chat" },
  { icon: Bell, label: "Notifications", path: "/app/notifications" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

const sidebarVariants: Variants = {
  hidden: {
    x: -40,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    x: -10,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
};



/* ------------------ Component ------------------ */

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0"
    >
      {/* ---------------- Logo ---------------- */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <FileText className="w-6 h-6 text-primary-foreground" />
          </motion.div>

          <div>
            <h1 className="text-xl font-bold text-foreground">DocuAI</h1>
            <p className="text-xs text-muted-foreground">
              Smart Document Hub
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Navigation ---------------- */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <motion.div key={item.path} variants={itemVariants}>
              <Link
                href={item.path}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.span
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 h-full w-1 bg-primary-foreground rounded-r"
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Label */}
                <motion.span
                  className="font-medium"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ---------------- Footer ---------------- */}
      <div className="p-4 border-t border-border">
        <motion.div
          className="bg-muted rounded-lg p-4"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-sm font-semibold text-foreground mb-1">
            Pro Plan
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            500 documents remaining
          </p>

          <Link
            href="/app/settings"
            className="text-xs text-primary hover:underline font-medium"
          >
            Upgrade Plan →
          </Link>
        </motion.div>
      </div>
    </motion.aside>
  );
}