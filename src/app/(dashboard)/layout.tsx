"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const user = useUserStore();
  // const role = user?.role;

  // useEffect(() => {
  //   if (role && role !== "Student") {
  //     router.replace("/home"); // use `replace` to avoid adding to history
  //   }
  // }, [role, router]);

  // // Optionally, you can prevent rendering while checking:
  // if (!role || role !== "Student") return null;

  const router = useRouter();
  const { role_names } = useUserStore();

  const hasRoleAccess = role_names?.includes("Student");

  useEffect(() => {
    if (!hasRoleAccess) {
      router.replace("/home"); // Redirect if they don’t have the role
    }
  }, [hasRoleAccess, router]);

  if (!hasRoleAccess) {
    return null; // prevent flicker
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-1 md:p-3">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
