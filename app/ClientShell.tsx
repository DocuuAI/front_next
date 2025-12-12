"use client";

import { useSyncUser } from "@/hooks/userSync";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useSyncUser();  // ⬅️ client hook runs here
  return <>{children}</>;
}
