// constants/Navbar.ts
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

export const navData = {
  student: {
    navMain: [
      { title: "Dashboard", url: "/home", icon: IconDashboard },
      { title: "Subjects", url: "/subjects", icon: IconListDetails },
      { title: "Reports", url: "/reports", icon: IconReport },
    ],
    documents: [],
    navSecondary: [
      { title: "Settings", url: "#", icon: IconSettings },
      { title: "Get Help", url: "#", icon: IconHelp },
    ],
  },
  teacher: {
    navMain: [
      { title: "Dashboard", url: "/home", icon: IconDashboard },
      { title: "Class", url: "/subjects", icon: IconListDetails },
      { title: "Analytics", url: "/analytics", icon: IconChartBar },
      { title: "Team", url: "/team", icon: IconUsers },
    ],
    documents: [{ name: "Reports", url: "/reports", icon: IconReport }],
    navSecondary: [
      { title: "Settings", url: "#", icon: IconSettings },
      { title: "Search", url: "#", icon: IconSearch },
    ],
  },
  parent: {
    navMain: [
      { title: "Dashboard", url: "/home", icon: IconDashboard },
      { title: "My Children", url: "/children", icon: IconUsers },
      { title: "Performance", url: "/performance", icon: IconChartBar },
    ],
    documents: [],
    navSecondary: [{ title: "Get Help", url: "#", icon: IconHelp }],
  },
};
