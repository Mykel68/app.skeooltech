"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";

export function SiteHeader() {
  const role = useUserStore((s) => s.role);
  const firstName = useUserStore((s) => s.firstName);
  const lastName = useUserStore((s) => s.lastName);
  const className = useUserStore((s) => s.class_name);
  const email = useUserStore((s) => s.email);

  // Helper to get nicely capitalized role
  const formattedRole = role
    ? `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()}`
    : "Portal";

  // Optional: Role-based emoji
  const roleEmoji =
    role?.toLowerCase() === "student"
      ? "🎓"
      : role?.toLowerCase() === "teacher"
      ? "🧑‍🏫"
      : role?.toLowerCase() === "parent"
      ? "👨‍👩‍👧‍👦"
      : "📘";

  return (
    <header className="sticky top-0 z-50 flex h-[--header-height] items-center border-b bg-white/90 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Sidebar trigger */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-4 h-6" />

      {/* LEFT: Portal Name / Brand */}
      <div className="flex items-center gap-2 font-bold text-emerald-700 text-lg">
        <span>{roleEmoji}</span>
        <span>{formattedRole} Portal</span>
      </div>

      <div className="flex-1" />

      {/* RIGHT: User Info */}
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex flex-col items-end text-right">
          <p className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[160px]">
            {role?.toLowerCase() === "student" ? className : email}
          </p>
        </div>

        {/* Avatar */}
        <div className="h-10 w-10 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold shadow">
          {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
