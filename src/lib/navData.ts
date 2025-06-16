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
} from '@tabler/icons-react';

import { IconProps } from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type NavItem = {
	title?: string;
	url: string;
	icon: ForwardRefExoticComponent<IconProps>; // ❌ remove SVGSVGElement ref
	name?: string;
};

// Student main navigation
export const studentNav: NavItem[] = [
	{ title: 'Dashboard', url: '/dashboard', icon: IconDashboard },
	{ title: 'Subjects', url: '/subjects', icon: IconBook },
	{ title: 'Results', url: '/results', icon: IconClipboardList },
];

// Teacher main navigation
export const teacherNav: NavItem[] = [
	{ title: 'Home', url: '/home', icon: IconDashboard },
	{ title: 'Classes', url: '/classes', icon: IconUser },
	// { title: 'Attendance', url: '/attendance', icon: IconReport },

	{ title: 'Gradebook', url: '/gradebook', icon: IconClipboardList },
];

// Documents for student (empty array typed as NavItem[])
export const studentDocuments: NavItem[] = [];

// Documents for teacher
export const teacherDocuments: NavItem[] = [
	{ name: 'Reports', url: '/reports', icon: IconReport },
	{ name: 'Attendance', url: '/attendance', icon: IconReport },
];

// Secondary nav for students
export const studentNavSecondary: NavItem[] = [
	{ title: 'Settings', url: '#', icon: IconSettings },
	{ title: 'Get Help', url: '#', icon: IconHelp },
];

// Secondary nav for teachers
export const teacherNavSecondary: NavItem[] = [
	{ title: 'Account', url: '/account', icon: IconSettings },
	{ title: 'Settings', url: '#', icon: IconSettings },
	{ title: 'Search', url: '#', icon: IconSearch },
];

// Secondary nav for parents
export const parentNavSecondary: NavItem[] = [
	{ title: 'Account', url: '/account', icon: IconSettings },
	{ title: 'Settings', url: '#', icon: IconSettings },
	{ title: 'Search', url: '#', icon: IconSearch },
];
