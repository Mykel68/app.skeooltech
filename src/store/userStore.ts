"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const safeStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(name);
    }
  },
};

interface UserState {
  userId: string | null;
  username: string | null;
  role: string | null;
  role_ids: number[] | null; // make sure these are here
  role_names: string[] | null; // make sure these are here
  schoolId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  schoolName: string | null;
  schoolImage: string | null;
  is_approved: boolean | null;
  schoolCode: string | null;
  session_id: string | null;
  term_id: string | null;
  class_id?: string | null;
  class_name?: string | null;
  class_grade_level?: string | null;
  setUser: (user: Partial<UserState>) => void; // <-- lets you pass only the fields you want
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      role: null,
      role_ids: null,
      role_names: null,
      schoolId: null,
      firstName: null,
      lastName: null,
      email: null,
      schoolName: null,
      schoolImage: null,
      is_approved: null,
      schoolCode: null,
      session_id: null,
      term_id: null,
      class_id: null,
      class_name: null,
      class_grade_level: null,
      setUser: (user) => {
        console.log("[UserStore] Updating user store:", user);
        set({ ...user });
      },
      clearUser: () => {
        console.log("[UserStore] Clearing user store");
        set({
          userId: null,
          username: null,
          role: null,
          role_ids: null,
          role_names: null,
          schoolId: null,
          firstName: null,
          lastName: null,
          email: null,
          schoolName: null,
          schoolImage: null,
          is_approved: null,
          schoolCode: null,
          session_id: null,
          term_id: null,
          class_id: null,
          class_name: null,
          class_grade_level: null,
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
