"use client";

import { useEffect, useState } from "react";
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
  const [checked, setChecked] = useState(false);

  const role = user?.role;

  useEffect(() => {
    if (!role) return;

    switch (role) {
      case "Student":
        router.replace("/dashboard");
        break;
      case "Teacher":
        router.replace("/home");
        break;
      case "Parent":
        setChecked(true); // allow rendering
        break;
      default:
        router.replace("/");
        break;
    }
  }, [role, router]);

  if (!role || !checked) {
    // Optional: loading spinner or null
    return <div>Please wait...</div>;
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
