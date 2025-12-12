"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/services/useUserStore";

export function useSyncUser() {
  const { user, isSignedIn } = useUser();
  const syncUser = useUserStore.getState().syncUser;

  useEffect(() => {
    if (isSignedIn && user) {
      syncUser(user);
    }
  }, [isSignedIn, user]);
}