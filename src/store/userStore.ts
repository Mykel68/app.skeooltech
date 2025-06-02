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
  setUser: (user: {
    userId?: string;
    username?: string;
    role?: string;
    schoolId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    schoolName?: string;
    schoolImage?: string;
    is_approved?: boolean;
    schoolCode?: string;
    session_id?: string;
    term_id?: string;
  }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      username: null,
      role: null,
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
        });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
