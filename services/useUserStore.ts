import { create } from "zustand";

interface UserState {
  profile: any | null;
  syncing: boolean;
  syncUser: (clerkUser: any) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  syncing: false,

  syncUser: async (clerkUser) => {
    try {
      set({ syncing: true });

      const email =
        clerkUser.emailAddresses?.[0]?.emailAddress || null;

      // Data we send to backend (NO clerk_id)
      const payload = {
        first_name: clerkUser.firstName,
        middle_name: clerkUser.middleName || null,
        last_name: clerkUser.lastName,
        email,
        phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
      };

      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("User sync failed:", data.error);
        set({ syncing: false });
        return;
      }

      set({
        profile: data.profile,
        syncing: false,
      });

    } catch (err) {
      console.error("User sync error:", err);
      set({ syncing: false });
    }
  },
}));