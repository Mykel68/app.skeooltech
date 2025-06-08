'use client';

import React, { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
	BookOpen,
	Users,
	Calendar,
	FileText,
	Clock,
	CheckCircle,
	AlertCircle,
	TrendingUp,
	MessageSquare,
	Award,
	Plus,
	Eye,
	Bell,
	Star,
	ClipboardList,
	BarChart3,
	Settings,
	Search,
	Filter,
	Download,
	Upload,
	Play,
	PauseCircle,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';

const TeacherHomeDashboard = () => {
	const [currentTime] = useState(
		new Date().toLocaleString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	);

	const [activeTab, setActiveTab] = useState('overview');
	const userName = useUserStore((state) => state.username);

	// Sample data - in real app this would come from API
	const todaySchedule = [
		{
			id: 1,
			time: '08:00 AM',
			subject: 'Mathematics',
			class: 'JSS 2A',
			room: 'Room 12',
			students: 35,
			status: 'upcoming',
			topic: 'Algebra Basics',
		},
		{
			id: 2,
			time: '10:30 AM',
			subject: 'Mathematics',
			class: 'SS 1B',
			room: 'Room 12',
			students: 28,
			status: 'current',
			topic: 'Quadratic Equations',
		},
		{
			id: 3,
			time: '01:15 PM',
			subject: 'Further Maths',
			class: 'SS 3A',
			room: 'Room 15',
			students: 22,
			status: 'upcoming',
			topic: 'Integration Methods',
		},
		{
			id: 4,
			time: '03:30 PM',
			subject: 'Mathematics',
			class: 'JSS 1C',
			room: 'Room 12',
			students: 40,
			status: 'upcoming',
			topic: 'Basic Arithmetic',
		},
	];

	const urgentTasks = [
		{
			id: 1,
			task: 'Grade Mid-Term Tests',
			class: 'JSS 2A',
			due: 'Today',
			priority: 'high',
			count: 35,
			type: 'grading',
		},
		{
			id: 2,
			task: 'Submit Lesson Plans',
			class: 'All Classes',
			due: 'Tomorrow',
			priority: 'high',
			count: 4,
			type: 'admin',
		},
		{
			id: 3,
			task: 'Prepare Quiz Questions',
			class: 'SS 1B',
			due: '2 days',
			priority: 'medium',
			count: 20,
			type: 'preparation',
		},
		{
			id: 4,
			task: 'Parent Meeting Prep',
			class: 'SS 3A',
			due: '3 days',
			priority: 'medium',
			count: 1,
			type: 'meeting',
		},
	];

	const recentNotifications = [
		{
			id: 1,
			type: 'submission',
			message: 'New assignment submitted',
			details: 'Adebayo O. - JSS 2A Assignment 3',
			time: '15 mins ago',
			read: false,
		},
		{
			id: 2,
			type: 'message',
			message: 'Parent inquiry received',
			details: "Mrs. Okafor regarding Chidi's performance",
			time: '1 hour ago',
			read: false,
		},
		{
			id: 3,
			type: 'alert',
			message: 'Deadline reminder',
			details: 'JSS 2A test papers due tomorrow',
			time: '2 hours ago',
			read: true,
		},
		{
			id: 4,
			type: 'achievement',
			message: 'Class milestone reached',
			details: 'SS 1B achieved 90% attendance rate',
			time: '1 day ago',
			read: true,
		},
	];

	const classPerformance = [
		{
			class: 'JSS 2A',
			students: 35,
			attendance: 94,
			avgScore: 78,
			assignments: 12,
			completed: 10,
			trend: 'up',
		},
		{
			class: 'SS 1B',
			students: 28,
			attendance: 89,
			avgScore: 82,
			assignments: 15,
			completed: 14,
			trend: 'up',
		},
		{
			class: 'SS 3A',
			students: 22,
			attendance: 91,
			avgScore: 85,
			assignments: 18,
			completed: 16,
			trend: 'stable',
		},
		{
			class: 'JSS 1C',
			students: 40,
			attendance: 87,
			avgScore: 75,
			assignments: 8,
			completed: 7,
			trend: 'down',
		},
	];

	const quickActions = [
		{ icon: Plus, label: 'Create Assignment', color: 'bg-blue-500' },
		{
			icon: ClipboardList,
			label: 'Take Attendance',
			color: 'bg-green-500',
		},
		{ icon: FileText, label: 'Grade Papers', color: 'bg-purple-500' },
		{ icon: Calendar, label: 'Schedule Class', color: 'bg-orange-500' },
		{ icon: MessageSquare, label: 'Send Message', color: 'bg-pink-500' },
		{ icon: BarChart3, label: 'View Reports', color: 'bg-indigo-500' },
	];

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800 border-red-200';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low':
				return 'bg-green-100 text-green-800 border-green-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'current':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'upcoming':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'completed':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'submission':
				return <CheckCircle className='h-4 w-4 text-green-600' />;
			case 'message':
				return <MessageSquare className='h-4 w-4 text-blue-600' />;
			case 'alert':
				return <AlertCircle className='h-4 w-4 text-orange-600' />;
			case 'achievement':
				return <Award className='h-4 w-4 text-purple-600' />;
			default:
				return <Bell className='h-4 w-4 text-gray-600' />;
		}
	};

	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up':
				return <TrendingUp className='h-4 w-4 text-green-600' />;
			case 'down':
				return (
					<TrendingUp className='h-4 w-4 text-red-600 rotate-180' />
				);
			default:
				return (
					<TrendingUp className='h-4 w-4 text-gray-600 rotate-90' />
				);
		}
	};

	const totalStudents = classPerformance.reduce(
		(sum, cls) => sum + cls.students,
		0
	);
	const avgAttendance = Math.round(
		classPerformance.reduce((sum, cls) => sum + cls.attendance, 0) /
			classPerformance.length
	);
	const avgPerformance = Math.round(
		classPerformance.reduce((sum, cls) => sum + cls.avgScore, 0) /
			classPerformance.length
	);
	const unreadNotifications = recentNotifications.filter(
		(n) => !n.read
	).length;

	return (
		<div className='min-h-screen h'>
			<div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2'>
				{/* Welcome Section */}
				<div className='mb-6'>
					<div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white'>
						<h2 className='text-2xl font-bold mb-2'>
							Welcome back, {userName}!
						</h2>
						<p className='text-blue-100 mb-4'>
							You have {todaySchedule.length} classes today and{' '}
							{
								urgentTasks.filter((t) => t.priority === 'high')
									.length
							}{' '}
							urgent tasks pending.
						</p>
						<div className='flex gap-3'>
							<Button
								variant='secondary'
								size='sm'
							>
								<Play className='h-4 w-4 mr-2' />
								Start Day
							</Button>
							<Button
								variant='outline'
								size='sm'
								className='text-white border-white hover:bg-white hover:text-blue-600'
							>
								<Eye className='h-4 w-4 mr-2' />
								View Schedule
							</Button>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
					<Card className='bg-gradient-to-r from-blue-500 to-blue-600 text-white'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-blue-100 text-sm font-medium'>
										Total Students
									</p>
									<p className='text-3xl font-bold'>
										{totalStudents}
									</p>
									<p className='text-blue-100 text-xs'>
										Across all classes
									</p>
								</div>
								<Users className='h-10 w-10 text-blue-200' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-gradient-to-r from-green-500 to-green-600 text-white'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-green-100 text-sm font-medium'>
										Today's Classes
									</p>
									<p className='text-3xl font-bold'>
										{todaySchedule.length}
									</p>
									<p className='text-green-100 text-xs'>
										1 in progress
									</p>
								</div>
								<BookOpen className='h-10 w-10 text-green-200' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-gradient-to-r from-purple-500 to-purple-600 text-white'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-purple-100 text-sm font-medium'>
										Avg Attendance
									</p>
									<p className='text-3xl font-bold'>
										{avgAttendance}%
									</p>
									<p className='text-purple-100 text-xs'>
										This week
									</p>
								</div>
								<TrendingUp className='h-10 w-10 text-purple-200' />
							</div>
						</CardContent>
					</Card>

					<Card className='bg-gradient-to-r from-orange-500 to-orange-600 text-white'>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-orange-100 text-sm font-medium'>
										Avg Performance
									</p>
									<p className='text-3xl font-bold'>
										{avgPerformance}%
									</p>
									<p className='text-orange-100 text-xs'>
										Current semester
									</p>
								</div>
								<Award className='h-10 w-10 text-orange-200' />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card className='mb-6'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Star className='h-5 w-5' />
							Quick Actions
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
							{quickActions.map((action, index) => (
								<Button
									key={index}
									variant='outline'
									className='h-20 flex-col gap-2 hover:shadow-md transition-shadow'
								>
									<div
										className={`p-2 rounded-lg ${action.color}`}
									>
										<action.icon className='h-5 w-5 text-white' />
									</div>
									<span className='text-xs font-medium'>
										{action.label}
									</span>
								</Button>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Main Content Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
					{/* Today's Schedule */}
					<div className='lg:col-span-2'>
						<Card>
							<CardHeader className='flex flex-row items-center justify-between'>
								<div>
									<CardTitle className='flex items-center gap-2'>
										<Calendar className='h-5 w-5' />
										Today's Schedule
									</CardTitle>
									<CardDescription>
										Your classes for today
									</CardDescription>
								</div>
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
									>
										<Filter className='h-4 w-4' />
									</Button>
									<Button
										variant='outline'
										size='sm'
									>
										<Download className='h-4 w-4' />
									</Button>
								</div>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									{todaySchedule.map((cls) => (
										<div
											key={cls.id}
											className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors'
										>
											<div className='flex items-center gap-4'>
												<div className='flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-lg border'>
													<Clock className='h-4 w-4 text-blue-600' />
													<span className='text-xs font-medium text-blue-600'>
														{cls.time}
													</span>
												</div>
												<div className='flex-1'>
													<div className='flex items-center gap-2 mb-1'>
														<h3 className='font-semibold text-gray-900'>
															{cls.subject}
														</h3>
														<Badge
															className={getStatusColor(
																cls.status
															)}
															variant='outline'
														>
															{cls.status}
														</Badge>
													</div>
													<p className='text-sm text-gray-600 mb-1'>
														{cls.class} • {cls.room}
													</p>
													<p className='text-xs text-gray-500'>
														{cls.topic}
													</p>
													<div className='flex items-center gap-2 mt-2'>
														<Users className='h-4 w-4 text-gray-400' />
														<span className='text-sm text-gray-600'>
															{cls.students}{' '}
															students
														</span>
													</div>
												</div>
											</div>
											<div className='flex gap-2'>
												{cls.status === 'current' ? (
													<Button
														size='sm'
														className='bg-green-600 hover:bg-green-700'
													>
														<PauseCircle className='h-4 w-4 mr-2' />
														In Session
													</Button>
												) : (
													<Button
														variant='outline'
														size='sm'
													>
														<Eye className='h-4 w-4 mr-2' />
														View
													</Button>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Urgent Tasks */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<AlertCircle className='h-5 w-5' />
								Urgent Tasks
							</CardTitle>
							<CardDescription>
								Items requiring immediate attention
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-3'>
								{urgentTasks.map((task) => (
									<div
										key={task.id}
										className='p-3 border rounded-lg hover:bg-gray-50 transition-colors'
									>
										<div className='flex items-start justify-between mb-2'>
											<h4 className='font-medium text-sm'>
												{task.task}
											</h4>
											<Badge
												className={getPriorityColor(
													task.priority
												)}
												variant='outline'
											>
												{task.priority}
											</Badge>
										</div>
										<p className='text-xs text-gray-600 mb-2'>
											{task.class}
										</p>
										<div className='flex items-center justify-between text-xs'>
											<span className='text-gray-500'>
												Due: {task.due}
											</span>
											<span className='text-gray-500'>
												{task.count} items
											</span>
										</div>
										<Button
											size='sm'
											variant='outline'
											className='w-full mt-2'
										>
											Start Task
										</Button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Bottom Section */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{/* Class Performance */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<BarChart3 className='h-5 w-5' />
								Class Performance Overview
							</CardTitle>
							<CardDescription>
								Current semester performance metrics
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{classPerformance.map((cls, index) => (
									<div
										key={index}
										className='p-4 border rounded-lg'
									>
										<div className='flex items-center justify-between mb-3'>
											<div className='flex items-center gap-2'>
												<h4 className='font-semibold text-gray-900'>
													{cls.class}
												</h4>
												{getTrendIcon(cls.trend)}
											</div>
											<span className='text-sm text-gray-600'>
												{cls.students} students
											</span>
										</div>
										<div className='grid grid-cols-2 gap-4 text-sm'>
											<div>
												<div className='flex justify-between mb-1'>
													<span className='text-gray-600'>
														Attendance
													</span>
													<span className='font-medium'>
														{cls.attendance}%
													</span>
												</div>
												<Progress
													value={cls.attendance}
													className='h-2'
												/>
											</div>
											<div>
												<div className='flex justify-between mb-1'>
													<span className='text-gray-600'>
														Avg Score
													</span>
													<span className='font-medium'>
														{cls.avgScore}%
													</span>
												</div>
												<Progress
													value={cls.avgScore}
													className='h-2'
												/>
											</div>
										</div>
										<div className='flex justify-between text-xs text-gray-500 mt-2'>
											<span>
												Assignments: {cls.completed}/
												{cls.assignments}
											</span>
											<span>
												Progress:{' '}
												{Math.round(
													(cls.completed /
														cls.assignments) *
														100
												)}
												%
											</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Recent Notifications */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Bell className='h-5 w-5' />
								Recent Notifications
								{unreadNotifications > 0 && (
									<Badge
										variant='destructive'
										className='ml-2'
									>
										{unreadNotifications} new
									</Badge>
								)}
							</CardTitle>
							<CardDescription>
								Latest updates and alerts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{recentNotifications.map((notification) => (
									<div
										key={notification.id}
										className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
											!notification.read
												? 'bg-blue-50 border border-blue-200'
												: 'hover:bg-gray-50'
										}`}
									>
										<div className='flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border'>
											{getNotificationIcon(
												notification.type
											)}
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-gray-900'>
												{notification.message}
											</p>
											<p className='text-sm text-gray-600 mb-1'>
												{notification.details}
											</p>
											<p className='text-xs text-gray-500'>
												{notification.time}
											</p>
										</div>
										{!notification.read && (
											<div className='w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2'></div>
										)}
									</div>
								))}
							</div>
							<Button
								variant='outline'
								className='w-full mt-4'
							>
								View All Notifications
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default TeacherHomeDashboard;
