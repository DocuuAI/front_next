// app/(protected)/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ClientWrapper from "./ClientWrapper";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <ClientWrapper>{children}</ClientWrapper>;
}