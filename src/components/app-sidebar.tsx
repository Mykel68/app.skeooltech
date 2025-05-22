// components/AppSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { restoreUserFromCookie } from "@/utils/restoreAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/store/userStore";
import { navData } from "@/constants/Navbar";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = useState<string>("teacher");
  const userRole = useUserStore((s) => s.role)!;
  const [hydrated, setHydrated] = useState(false);
  const user = useUserStore((s) => s);

  const { navMain, documents, navSecondary } =
    navData[role] || navData["teacher"];

  // On mount, restore user from cookie
  useEffect(() => {
    try {
      setRole(userRole);
      restoreUserFromCookie();
    } catch (e) {
      console.error(e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // While restoring, you can return null or a loader
  if (!hydrated) return null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.schoolImage || "/placeholder-logo.png"}
                  alt={user.schoolName || "School logo"}
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder-logo.png";
                  }}
                />
                <span className="text-base font-semibold">
                  {user.schoolName || "Loading..."}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
