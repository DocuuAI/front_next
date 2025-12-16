'use client';

import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useAppStore } from "@/contexts/AppContext";
import { useDocumentsRealtime } from "@/lib/useDocumentRealtime";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const setDocuments = useAppStore((s) => s.setDocuments);

  // 1️⃣ Initial fetch from backend (via Next API route)
  useEffect(() => {
    let cancelled = false;

    async function loadDocuments() {
      const res = await fetch("/api/calldocument", {
        method: "POST",
      });

      const data = await res.json();
      console.log("DOCUMENT API RESPONSE:", data);

      if (!cancelled && data?.documents) {
        setDocuments(data.documents);
      }
    }

    loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [setDocuments]);

  // 2️⃣ Start realtime listener (SSE / WebSocket → backend → DB)
  useDocumentsRealtime();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}