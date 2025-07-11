"use client";

import LinkChildPage from "../../link/page";
import ParentDashboard from "./ParentDashboard";
import { useUserStore } from "@/store/userStore";

export default function Index() {
  const approved = useUserStore((state) => state.is_approved);

  if (!approved) {
    // Not linked yet
    return <LinkChildPage />;
  }

  // Linked/approved
  return <ParentDashboard />;
}
