"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Document,
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

  setDocuments: (docs: Document[]) => void; // ✅ ADD
  setSearchQuery: (query: string) => void;

  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  addEntity: (entity: Entity) => void;
  updateEntity: (id: string, updates: Partial<Entity>) => void;

  markNotificationRead: (id: string) => void;
  setAvatarUrl: (url: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      documents: [], // ❌ REMOVE mockDocuments
      entities: mockEntities,
      deadlines: mockDeadlines,
      notifications: mockNotifications,
      unreadNotifications: mockNotifications.filter((n) => !n.read),
      aiSuggestions: mockAISuggestions,

      avatarUrl: null,
      searchQuery: "",

      setDocuments: (docs) => set({ documents: docs }), // ✅ ADD

      setSearchQuery: (query) => set({ searchQuery: query }),

      addDocument: (doc) =>
        set((state) => ({
          documents: [doc, ...state.documents],
        })),

      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),

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
      partialize: (state) => ({
        avatarUrl: state.avatarUrl,
      }),
    }
  )
);

export const useUnreadNotifications = () =>
  useAppStore((state) => state.unreadNotifications);