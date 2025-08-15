"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ClassTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { role_names } = useUserStore();

  const hasRoleAccess = role_names?.includes("Class Teacher");

  useEffect(() => {
    if (!hasRoleAccess) {
      router.replace("/dashboard"); // Redirect if they don’t have the role
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
        <main className="p-1 md:p-3">
          <div className="mt-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
