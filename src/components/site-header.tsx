"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Settings } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export function SiteHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const role = useUserStore((s) => s.role);
  const firstName = useUserStore((s) => s.firstName);
  const lastName = useUserStore((s) => s.lastName);
  const className = useUserStore((s) => s.class_name);
  const classGradeLevel = useUserStore((s) => s.class_grade_level);
  const email = useUserStore((s) => s.email);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const formattedDate = currentTime.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="sticky top-0 z-50 flex h-[--header-height] items-center border-b bg-background  py-4 px-4 sm:px-6 lg:px-8 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-4 h-6" />

      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Today&apos;s Date
          </h1>
          <p className="text-sm text-gray-600">{formattedDate}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {firstName} {lastName}
            </p>
            <p className="text-xs text-gray-600">{`${
              role === "Student" ? className : email
            }`}</p>{" "}
          </div>

          <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
