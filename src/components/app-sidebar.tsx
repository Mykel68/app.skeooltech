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
import axios from "axios";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const schoolId = useUserStore((s) => s.schoolId);
  const setUser = useUserStore((s) => s.setUser);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [currentTerm, setCurrentTerm] = useState<any>(null);
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
    }
  }, [role]);

  const fetchSessions = async () => {
    if (!schoolId) return;
    const res = await axios.get(`/api/term/get-all-terms/${schoolId}`);
    const sessionData = res.data?.data?.data?.sessions;

    if (!sessionData) throw new Error("Failed to fetch sessions");

    return Object.entries(sessionData).map(([id, session]) => ({
      ...session,
      session_id: id,
    }));
  };

  useEffect(() => {
    if (!schoolId) return;

    fetchSessions()
      .then((data) => {
        setSessions(data);
        const defaultSession = data[0];
        const defaultTerm = defaultSession.terms?.[0] ?? null;

        setCurrentSession(defaultSession);
        setCurrentTerm(defaultTerm);

        setUser({
          session_id: defaultSession.session_id,
          term_id: defaultTerm?.term_id || null,
        });
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, [schoolId, setUser]);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedSession = sessions.find((s) => s.session_id === selectedId);
    if (selectedSession) {
      const firstTerm = selectedSession.terms?.[0] || null;
      setCurrentSession(selectedSession);
      setCurrentTerm(firstTerm);
      setUser({
        session_id: selectedSession.session_id,
        term_id: firstTerm?.term_id || null,
      });
    }
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTermId = e.target.value;
    const selectedTerm = currentSession?.terms?.find(
      (t: any) => t.term_id === selectedTermId
    );
    if (selectedTerm) {
      setCurrentTerm(selectedTerm);
      setUser({ term_id: selectedTerm.term_id });
    }
  };

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
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:!bg-transparent"
              size="xl"
            >
              <div className="flex gap-1 w-full">
                <img
                  src={user.schoolImage || "/placeholder-logo.png"}
                  alt={user.schoolName || "School logo"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder-logo.png";
                  }}
                />
                <div className="">
                  <span className="text-base font-semibold">
                    {user.schoolName || "Loading..."}
                  </span>
                  {sessions.length <= 1 && currentSession ? (
                    <p className="text-xs text-white mt-1">
                      {currentSession.name} - {currentTerm?.name}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <select
                        value={currentSession?.session_id || ""}
                        onChange={handleSessionChange}
                        className="text-xs bg-green-800 text-white rounded px-2 py-1 outline-none focus:ring-1 ring-white w-full"
                      >
                        {sessions.map((session) => (
                          <option
                            key={session.session_id}
                            value={session.session_id}
                          >
                            {session.name}
                          </option>
                        ))}
                      </select>

                      {currentSession?.terms?.length > 0 && (
                        <select
                          value={currentTerm?.term_id || ""}
                          onChange={handleTermChange}
                          className="text-xs bg-green-800 text-white rounded px-2 py-1 outline-none focus:ring-1 ring-white w-full"
                        >
                          {currentSession.terms.map((term: any) => (
                            <option key={term.term_id} value={term.term_id}>
                              {term.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
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
