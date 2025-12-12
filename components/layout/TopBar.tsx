"use client";

import { Search, Bell, User } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAppStore, useUnreadNotifications } from "@/contexts/AppContext";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TopBar() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const unreadNotifications = useUnreadNotifications();
  const unreadNotificationsCount = unreadNotifications.length;
  const avatarUrl = useAppStore((state) => state.avatarUrl);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);

  const photo = avatarUrl || null;

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder="Search documents, entities, or ask AI..."
            className="pl-10 bg-background"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              router.push("/app/searchpage");
            }}
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push("/app/notifications")}
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadNotificationsCount}
            </Badge>
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full p-0">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </Button>
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
    </header>
  );
}
