"use client";

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavMain({
  items,
  activeUrl, // add activeUrl prop here
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  activeUrl: string; // current pathname
}) {
  // Function to check if item is active
  const isActive = (url: string) => {
    if (url === "/") return activeUrl === "/";
    return activeUrl === url || activeUrl.startsWith(url + "/");
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  size={"lg"}
                  className={
                    isActive(item.url)
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
