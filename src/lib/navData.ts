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
  IconHome,
} from "@tabler/icons-react";

import { IconProps } from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItem = {
  title?: string;
  url: string;
  icon: ForwardRefExoticComponent<IconProps>; // ❌ remove SVGSVGElement ref
  name?: string;
};

// Student main navigation
// export const studentNav: NavItem[] = [
// 	{ title: 'Dashboard', url: '/dashboard', icon: IconDashboard },
// 	{ title: 'Subjects', url: '/subjects', icon: IconBook },
// 	{ title: 'Results', url: '/results', icon: IconClipboardList },
// ];
export const studentNav: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
  { title: "Subjects", url: "/subjects", icon: IconBook },
  { title: "Results", url: "/results", icon: IconClipboardList },
  { title: "Attendance", url: "/attendance_", icon: IconReport }, // NEW
  { title: "Report Card", url: "/report-card", icon: IconReport }, // NEW
];

// Teacher main navigation
// export const teacherNav: NavItem[] = [
// 	{ title: 'Home', url: '/home', icon: IconDashboard },
// 	{ title: 'Classes', url: '/classes', icon: IconUser },
// 	// { title: 'Attendance', url: '/attendance', icon: IconReport },

// 	{ title: 'Gradebook', url: '/gradebook', icon: IconClipboardList },
// ];
export const teacherNav: NavItem[] = [
  { title: "Home", url: "/home", icon: IconHome },
  { title: "Subjects", url: "/classes", icon: IconBook },
  // { title: "Students", url: "/students", icon: IconUser }, // NEW
  // { title: "Gradebook", url: "/gradebook", icon: IconClipboardList },
  { title: "Attendance", url: "/attendance", icon: IconReport }, // MOVED from documents
  // { title: "Reports", url: "/reports", icon: IconReport }, // MOVED from documents
];

// Parent main navigation
export const parentNav: NavItem[] = [
  { title: "Home", url: "/parent/home", icon: IconHome },
  { title: "Updates", url: "/updates", icon: IconClipboardList }, // NEW
  { title: "Results", url: "/parent/results", icon: IconReport }, // NEW
];

// Documents for student (empty array typed as NavItem[])
// export const studentDocuments: NavItem[] = [];

// Documents for teacher
export const teacherDocuments: NavItem[] = [
  { name: "Updates", url: "/updates", icon: IconClipboardList }, // NEW
  { name: "Settings", url: "#", icon: IconSettings },
  { name: "Get Help", url: "#", icon: IconHelp },
];

// Secondary nav for students
export const studentDocuments: NavItem[] = [
  { name: "Updates", url: "/updates", icon: IconClipboardList }, // NEW
  { name: "Settings", url: "#", icon: IconSettings },
  { name: "Get Help", url: "#", icon: IconHelp },
];

// Secondary nav for parents
export const parentDocuments: NavItem[] = [
  { name: "Settings", url: "#", icon: IconSettings },
  { name: "Get Help", url: "#", icon: IconHelp },
];

// Secondary nav for teachers
// export const teacherNavSecondary: NavItem[] = [
//   { title: "Account", url: "/account", icon: IconSettings },
//   { title: "Settings", url: "#", icon: IconSettings },
//   { title: "Search", url: "#", icon: IconSearch },
// ];

// Secondary nav for parents
export const parentNavSecondary: NavItem[] = [
  { title: "Account", url: "/account", icon: IconSettings },
  { title: "Settings", url: "#", icon: IconSettings },
  { title: "Search", url: "#", icon: IconSearch },
];
