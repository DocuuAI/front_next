"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Document } from "@/types/document";
import { Entity } from "@/types/entity";

import {
  Deadline,
  Notification,
  AISuggestion,
  mockDeadlines,
  mockNotifications,
  mockAISuggestions,
} from "@/lib/mockData";

interface AppStore {
  /* -------- DATA -------- */
  documents: Document[];
  entities: Entity[];

  deadlines: Deadline[];
  notifications: Notification[];
  unreadNotifications: Notification[];
  aiSuggestions: AISuggestion[];

  avatarUrl: string | null;
  searchQuery: string;

  /* -------- DOCUMENTS -------- */
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  updateDocument: (id: number, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (id: number) => Promise<void>;

  /* -------- ENTITIES (BACKEND) -------- */
  setEntities: (entities: Entity[]) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;

  /* -------- UI / META -------- */
  setSearchQuery: (query: string) => void;
  markNotificationRead: (id: string) => void;
  setAvatarUrl: (url: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      /* ---------------- STATE ---------------- */
      documents: [],
      entities: [], // ✅ backend-driven

      deadlines: mockDeadlines,
      notifications: mockNotifications,
      unreadNotifications: mockNotifications.filter((n) => !n.read),
      aiSuggestions: mockAISuggestions,

      avatarUrl: null,
      searchQuery: "",

      /* ---------------- DOCUMENTS ---------------- */
      setDocuments: (docs) => set({ documents: docs }),

      addDocument: (doc) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),

      updateDocument: async (id, updates) => {
        const res = await fetch(`/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) throw new Error("Failed to update document");

        const updated: Document = await res.json();

        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? updated : doc
          ),
        }));
      },

      deleteDocument: async (id) => {
        const prev = get().documents;

        // Optimistic UI
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));

        try {
          const res = await fetch(`/api/deletedocument/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error();
        } catch {
          set({ documents: prev }); // rollback
        }
      },

      /* ---------------- ENTITIES ---------------- */
      setEntities: (entities) => set({ entities }),

      addEntity: (entity) =>
        set((state) => ({
          entities: [entity, ...state.entities],
        })),

      updateEntity: (id, updates) =>
        set((state) => ({
          entities: state.entities.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),


      /* ---------------- UI / META ---------------- */
      setSearchQuery: (query) => set({ searchQuery: query }),

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

      // ✅ Persist ONLY UI preferences
      partialize: (state) => ({
        avatarUrl: state.avatarUrl,
        searchQuery: state.searchQuery,
      }),
    }
  )
);

export const useUnreadNotifications = () =>
  useAppStore((state) => state.unreadNotifications);