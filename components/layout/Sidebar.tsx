"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/app/dashboard" },
  { icon: Upload, label: "Upload", path: "/app/upload" },
  { icon: FolderOpen, label: "Library", path: "/app/library" },
  { icon: Users, label: "Entities", path: "/app/entities" },
  { icon: MessageSquare, label: "AI Assistant", path: "/app/chat" },
  { icon: Bell, label: "Notifications", path: "/app/notifications" },
  { icon: Settings, label: "Settings", path: "/app/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">DocuAI</h1>
            <p className="text-xs text-muted-foreground">Smart Document Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-1">Pro Plan</p>
          <p className="text-xs text-muted-foreground mb-3">
            500 documents remaining
          </p>

          <Link
            href="/app/settings"
            className="text-xs text-primary hover:underline font-medium"
          >
            Upgrade Plan →
          </Link>
        </div>
      </div>
    </aside>
  );
}