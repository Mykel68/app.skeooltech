"use client";

import { useUserStore } from "@/store/userStore";
import { deleteCookie } from "cookies-next";

export function logout() {
  // Clear Zustand store
  useUserStore.getState().clearUser();

  // Clear local storage
  localStorage.clear();

  // Clear session storage
  sessionStorage.clear();

  // Delete auth token cookie (adjust name as needed)
  deleteCookie("s_id");
}
