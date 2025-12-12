import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface UserState {
  profile: any | null;
  syncing: boolean;
  syncUser: (clerkUser: any) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  syncing: false,

  syncUser: async (clerkUser) => {
    set({ syncing: true });

    const email =
      clerkUser.emailAddresses?.[0]?.emailAddress || null;

    const data = {
      clerk_id: clerkUser.id,
      first_name: clerkUser.firstName,
      middle_name: clerkUser.middleName || null,
      last_name: clerkUser.lastName,
      email,
      phone: clerkUser.phoneNumbers?.[0]?.phoneNumber || null,
    };

    const { data: upserted, error } = await supabase
      .from("users")
      .upsert(data, { onConflict: "clerk_id" })
      .select()
      .single();

    if (error) console.error("User sync error:", error);

    set({ profile: upserted || null, syncing: false });
  },
}));