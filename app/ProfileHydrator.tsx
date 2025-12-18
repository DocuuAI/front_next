"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserprofile";
import { useAppStore } from "@/contexts/AppContext";

export default function ProfileHydrator() {
  const { profile } = useUserProfile();
  const setAvatarUrl = useAppStore((s) => s.setAvatarUrl);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, setAvatarUrl]);

  return null;
}