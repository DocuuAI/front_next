"use client";

import { Search, Bell, User } from "lucide-react";
import {
  motion,
  AnimatePresence,
  Variants,
  useAnimationControls,
} from "framer-motion";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAppStore } from "@/contexts/AppContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

/* ------------------ Variants (Typed) ------------------ */

const topbarVariants: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const badgeVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 500 },
  },
};

export default function TopBar() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const avatarUrl = useAppStore((state) => state.avatarUrl);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const photo = avatarUrl || user?.imageUrl || null;

  /* 🔑 Animation controls for search focus */
  const searchControls = useAnimationControls();
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;

        const data = await res.json();
        const notifications = data.notifications ?? [];

        setUnreadNotificationsCount(
          notifications.filter((n: any) => !n.read).length
        );
      } catch (err) {
        console.error("Failed to fetch unread notifications", err);
      }
    };

    fetchUnreadCount();
  }, []);

  return (
    <motion.header
      variants={topbarVariants}
      initial="hidden"
      animate="visible"
      className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10"
    >
      {/* ---------------- Search ---------------- */}
      <motion.div
        className="flex-1 max-w-xl"
        animate={searchControls}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search documents, entities, or ask AI..."
            className="pl-10 bg-background"
            onFocus={() => searchControls.start({ scale: 1.02 })}
            onBlur={() => searchControls.start({ scale: 1 })}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              router.push("/app/searchpage");
            }}
          />
        </div>
      </motion.div>

      {/* ---------------- Right Actions ---------------- */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => router.push("/app/notifications")}
          >
            <Bell className="w-5 h-5" />

            <AnimatePresence>
              {unreadNotificationsCount > 0 && (
                <motion.div
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute -top-1 -right-1"
                >
                  <Badge
                    variant="destructive"
                    className="w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotificationsCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-0"
              >
                {photo ? (
                  <motion.img
                    src={photo}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    whileHover={{ rotate: 3 }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </Button>
            </motion.div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/app/settings")}>
              Profile Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/app/settings")}>
              Subscription
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                signOut(() => {
                  window.location.href = "/";
                })
              }
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}