// app/clerk/callback/page.tsx
"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function ClerkCallback() {
  return <AuthenticateWithRedirectCallback />;
}