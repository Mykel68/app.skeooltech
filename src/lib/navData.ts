// lib/navData.ts
import {
  IconDashboard,
  IconUser,
  IconSettings,
  IconBook,
  IconClipboardList,
  IconReport,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconProps } from "@tabler/icons-react";

export type NavItem = {
  title?: string;
  url: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
  name?: string;
};

// Student main navigation
export const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Subjects", url: "/subjects", icon: IconBook },
  { title: "Results", url: "/results", icon: IconClipboardList },
];

// Teacher main navigation
export const teacherNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "My Students", url: "/students", icon: IconUser },
  { title: "Gradebook", url: "/gradebook", icon: IconClipboardList },
];

// Documents for student (empty array typed as NavItem[])
export const studentDocuments: NavItem[] = [];

// Documents for teacher
export const teacherDocuments: NavItem[] = [
  { name: "Reports", url: "/reports", icon: IconReport },
];

// Secondary nav for students
export const studentNavSecondary: NavItem[] = [
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Get Help", url: "#", icon: IconHelp },
];

// Secondary nav for teachers
export const teacherNavSecondary: NavItem[] = [
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Search", url: "#", icon: IconSearch },
];

// Secondary nav for parents
export const parentNavSecondary: NavItem[] = [
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Search", url: "#", icon: IconSearch },
];
