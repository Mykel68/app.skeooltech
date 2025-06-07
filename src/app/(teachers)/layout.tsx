"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUserStore();
  const role = user?.role;

  useEffect(() => {
    if (role && role !== "Teacher") {
      router.replace("/dashboard"); // avoid back button returning to restricted area
    }
  }, [role, router]);

  // Wait until we confirm the user role to avoid flickering
  if (!role || role !== "Teacher") return null;

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
        <main className="p-3">
          <div className="mt-4">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
