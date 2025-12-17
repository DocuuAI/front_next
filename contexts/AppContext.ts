"use client";

import { Document } from "@/types/document";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Entity,
  Deadline,
  Notification,
  AISuggestion,
  mockEntities,
  mockDeadlines,
  mockNotifications,
  mockAISuggestions,
} from "@/lib/mockData";

interface AppStore {
  documents: Document[];
  entities: Entity[];
  deadlines: Deadline[];
  notifications: Notification[];
  unreadNotifications: Notification[];
  aiSuggestions: AISuggestion[];

  avatarUrl: string | null;
  searchQuery: string;

  setDocuments: (docs: Document[]) => void;
  setSearchQuery: (query: string) => void;

  addDocument: (doc: Document) => void;
  updateDocument: (id: number, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;

  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;

  markNotificationRead: (id: string) => void;
  setAvatarUrl: (url: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      documents: [],
      entities: mockEntities,
      deadlines: mockDeadlines,
      notifications: mockNotifications,
      unreadNotifications: mockNotifications.filter((n) => !n.read),
      aiSuggestions: mockAISuggestions,

      avatarUrl: null,
      searchQuery: "",

      // Actions
      setDocuments: (docs) => set({ documents: docs }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addDocument: (doc) =>
        set((state) => ({ documents: [doc, ...state.documents] })),

      updateDocument: async (id: number, updates: Partial<Document>) => {
        const res = await fetch(`/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) throw new Error("Failed to update document");

        const updated = await res.json();

        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? updated : doc
          ),
        }));
      },

      deleteDocument: async (id: number) => {
        const prev = get().documents; // ✅ get is now defined

        // Optimistic UI update
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));

        try {
          const res= await fetch(`/api/deletedocument/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Delete failed");
        } catch {
          set({ documents: prev }); // rollback if backend fails
        }
      },

      addEntity: (entity) =>
        set((state) => ({ entities: [entity, ...state.entities] })),

      updateEntity: (id, updates) =>
        set((state) => ({
          entities: state.entities.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      markNotificationRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications,
            unreadNotifications: notifications.filter((n) => !n.read),
          };
        }),

      setAvatarUrl: (url) => set({ avatarUrl: url }),
    }),
    {
      name: "app-store",
      partialize: (state) => ({ avatarUrl: state.avatarUrl }),
    }
  )
);

export const useUnreadNotifications = () =>
  useAppStore((state) => state.unreadNotifications);