"use client";

import { useSyncUser } from "@/hooks/userSync";
import ProfileHydrator from "./ProfileHydrator";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useSyncUser();  // ⬅️ client hook runs here
  return <> <ProfileHydrator /> {children}</>;
}
