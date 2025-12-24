"use client";

import { useEffect } from "react";
import { useAppStore } from "@/contexts/AppContext";

export function useDocumentsRealtime() {
  const addDocument = useAppStore((s) => s.addDocument);
  const deleteDocument = useAppStore((s) => s.deleteDocument);

  useEffect(() => {
    const socket = new WebSocket(
      "wss://http://127.0.0.1:4000/ws/documents"
    );

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "INSERT") {
        addDocument(msg.record);
      }

      if (msg.type === "DELETE") {
        deleteDocument(msg.old.id);
      }
    };

    socket.onerror = (err) => {
      console.error("Documents realtime error", err);
    };

    return () => {
      socket.close();
    };
  }, [addDocument, deleteDocument]);
}