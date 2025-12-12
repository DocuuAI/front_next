"use client";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!isLoaded || !user) return;

    setLoading(true);
    const res = await fetch(`/api/user/profile?clerkId=${user.id}`, {
      cache: "no-store",
    });

    const data = await res.json();

    setProfile(data.profile || null);
    setLoading(false);
  }, [isLoaded, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profile, loading, refresh: loadProfile };
}