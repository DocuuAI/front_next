"use client";

import { useUser, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export default function ProtectedRoute({
  children,
  redirectPath = "/sign-in",
}: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectPath);
    }
  }, [isSignedIn, isLoaded, router, redirectPath]);

  if (!isLoaded || !isSignedIn) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}