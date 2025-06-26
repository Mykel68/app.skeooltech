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
  // studentNavSecondary,
  // teacherNavSecondary,
} from "@/lib/navData";
import { usePathname } from "next/navigation";
import axios from "axios";

type Term = {
  term_id: string;
  name: string;
};

type Session = {
  session_id: string;
  session_name: string;
  terms: Term[];
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const schoolId = useUserStore((s) => s.schoolId);
  const setUser = useUserStore((s) => s.setUser);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentTerm, setCurrentTerm] = useState<Term | null>(null);
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);
  const user = useUserStore();
  const role = user?.role;
  const navItems = role === "Student" ? studentNav : teacherNav;
  // const navSecondary =
  //   role === "Student" ? studentNavSecondary : teacherNavSecondary;
  const documents = role === "Student" ? studentDocuments : teacherDocuments;

  useEffect(() => {
    restoreUserFromCookie();
  }, []);

  useEffect(() => {
    if (role) {
      setHydrated(true);
    }
  }, [role]);

  const fetchSessions = async (): Promise<Session[]> => {
    if (!schoolId) return [];

    const res = await axios.get(`/api/sessions/${schoolId}`);
    const sessionData = res.data?.data;

    if (!sessionData) throw new Error("Failed to fetch sessions");

    return Object.entries(sessionData).map(([id, session]) => ({
      session_id: id,
      ...(session as Omit<Session, "session_id">),
    }));
  };

  useEffect(() => {
    if (!schoolId) return;

    fetchSessions()
      .then((data) => {
        setSessions(data);
        const defaultSession = data.find((s) => s.terms?.length > 0) || null;
        const defaultTerm = defaultSession?.terms?.[0] || null;

        if (defaultSession) {
          setCurrentSession(defaultSession);
          setCurrentTerm(defaultTerm);
          setUser({
            session_id: defaultSession.session_id,
            term_id: defaultTerm?.term_id || undefined,
          });
        }
      })
      .catch((err) => console.error("Error fetching sessions:", err));
  }, [schoolId, setUser]);

  const handleSessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedSession = sessions.find((s) => s.session_id === selectedId);
    if (!selectedSession) return;

    const firstTerm = selectedSession.terms?.[0] || null;
    setCurrentSession(selectedSession);
    setCurrentTerm(firstTerm);
    setUser({
      session_id: selectedSession.session_id,
      term_id: firstTerm?.term_id || undefined,
    });
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTermId = e.target.value;
    const selectedTerm = currentSession?.terms?.find(
      (t: any) => t.term_id === selectedTermId
    );
    if (!selectedTerm) return;

    setCurrentTerm(selectedTerm);
    setUser({ term_id: selectedTerm.term_id });
  };

  if (!hydrated) {
    return null;
  }

  const safeNavItems = navItems.map((item) => ({
    ...item,
    title: item.title ?? "Untitled",
  }));

  const safeDocuments = documents.map((item) => ({
    ...item,
    name: item.name ?? "Untitled Document",
  }));

  // const safeSecondary = navSecondary.map((item) => ({
  //   ...item,
  //   title: item.title ?? "Untitled",
  // }));

  const safeUser = {
    ...user,
    // avatar: user.avatar ?? '/default-avatar.png',
    username: user.username ?? "unknown",
    email: user.email ?? "no-email@example.com",
  };

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
                <div>
                  <span className="text-base font-semibold">
                    {user.schoolName || "Loading..."}
                  </span>

                  {(currentSession?.terms?.length ?? 0) <= 1 ? (
                    <p className="text-xs text-green-700 mt-1">
                      {currentSession?.session_name} –{" "}
                      {currentTerm?.name || "No Term"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 w-full mt-1">
                      <select
                        value={currentSession?.session_id || ""}
                        onChange={handleSessionChange}
                        className="text-xs bg-popover text-black rounded px-2 py-1 outline-none focus:ring-1 ring-white w-full"
                      >
                        {sessions.map((session) => (
                          <option
                            key={session.session_id}
                            value={session.session_id}
                          >
                            {session.session_name}
                          </option>
                        ))}
                      </select>

                      <select
                        value={currentTerm?.term_id || ""}
                        onChange={handleTermChange}
                        className="text-xs bg-popover text-black rounded px-2 py-1 outline-none focus:ring-1 ring-white w-full"
                      >
                        {Array.isArray(currentSession?.terms) &&
                          currentSession.terms.map((term: any) => (
                            <option key={term.term_id} value={term.term_id}>
                              {term.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={safeNavItems} activeUrl={pathname} />
        <NavDocuments
          items={safeDocuments}
          activeUrl={pathname}
          className="cursor-pointer"
        />

        {/* <NavSecondary
          items={safeSecondary}
          activeUrl={pathname}
          className="mt-auto"
        /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={safeUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
