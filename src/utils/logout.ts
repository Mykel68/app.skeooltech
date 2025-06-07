"use client";

import { useUserStore } from "@/store/userStore";
import { deleteCookie } from "cookies-next";

export function logout() {
  // Clear Zustand store
  useUserStore.getState().clearUser();

  // Delete auth token cookie (adjust name as needed)
  deleteCookie("s_id");
}
