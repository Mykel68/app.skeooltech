"use client";

import { useEffect, useState } from "react";
import * as React from "react";
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
import {
  studentNav,
  teacherNav,
  studentDocuments,
  teacherDocuments,
  studentNavSecondary,
  teacherNavSecondary,
} from "@/lib/navData";
import { usePathname } from "next/navigation";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const user = useUserStore();
  const role = user?.role;
  const navItems = role === "Student" ? studentNav : teacherNav;
  const navSecondary =
    role === "Student" ? studentNavSecondary : teacherNavSecondary;
  const documents = role === "Student" ? studentDocuments : teacherDocuments;

  useEffect(() => {
    restoreUserFromCookie();
  }, []);

  useEffect(() => {
    if (role) {
      setHydrated(true);
      // console.log("user", user);
    }
  }, [role]);

  if (!hydrated) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Loading sidebar...
      </div>
    );
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 "
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
        <NavMain items={navItems} activeUrl={pathname} />
        <NavDocuments
          items={documents}
          activeUrl={pathname}
          className="cursor-pointer"
        />
        <NavSecondary
          items={navSecondary}
          activeUrl={pathname}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
