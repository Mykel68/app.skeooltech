"use client";

import * as React from "react";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavSecondary({
  items,
  activeUrl,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
  activeUrl: string;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const isActive = (url: string) => {
    if (url === "/") return activeUrl === "/";
    return activeUrl === url || activeUrl.startsWith(url + "/");
  };
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarGroupLabel>Others</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={
                  isActive(item.url)
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    : "cursor-pointer"
                }
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
