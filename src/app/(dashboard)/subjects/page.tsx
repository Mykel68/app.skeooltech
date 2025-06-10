'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
	BookOpen,
	User,
	Clock,
	FileText,
	Download,
	Mail,
	Calendar,
	Award,
	AlertCircle,
	CheckCircle,
	Star,
	ChevronRight,
} from 'lucide-react';

type Subject = {
	subject_id: string;
	name: string;
	short: string;
	teacher_name?: string | null;
	teacher_email?: string;
	description?: string;
	credits?: number;
	schedule?: {
		day: string;
		time: string;
		room: string;
	}[];
	teacher?: {
		username: string;
		email: string;
	};
};

type Assignment = {
	id: string;
	title: string;
	due_date: string;
	status: 'pending' | 'submitted' | 'graded';
	grade?: number;
	max_grade?: number;
	subject_id?: string;
};

type Resource = {
	id: string;
	title: string;
	type: 'pdf' | 'doc' | 'ppt' | 'video' | 'link';
	uploaded_date: string;
	size?: string;
	subject_id?: string;
};

type Grade = {
	id: string;
	assessment_name: string;
	grade: number;
	max_grade: number;
	date: string;
	type: 'test' | 'assignment' | 'quiz' | 'project';
	subject_id?: string;
};

export default function StudentSubjectsPage() {
	const studentName = useUserStore((s) => s.firstName) || 'Student';
	const schoolId = useUserStore((s) => s.schoolId) || 'default-school';
	const studentId = useUserStore((s) => s.userId) || 'default-student';

	// Fetch class details
	const { data: classDetails, isLoading: classLoading } = useQuery({
		queryKey: ['studentClass', schoolId, studentId],
		queryFn: async () => {
			try {
				const { data } = await axios.get(
					`/api/student/class/details/${schoolId}/${studentId}`
				);
				return data.data;
			} catch (error) {
				console.error('Failed to fetch class details:', error);
				return null;
			}
		},
		enabled: !!schoolId && !!studentId,
	});

	// Fetch subjects
	const { data: subjects, isLoading: subjectsLoading } = useQuery({
		queryKey: ['studentSubjects', schoolId, studentId],
		queryFn: async () => {
			try {
				const classId = classDetails?.class_id || 'default-class';
				const { data } = await axios.get(
					`/api/subject/by-student/${classId}`
				);
				return data.data;
			} catch (error) {
				console.error('Failed to fetch subjects:', error);
				return null;
			}
		},
		enabled: !!classDetails?.class_id,
	});

	// Fetch assignments
	const { data: assignments } = useQuery({
		queryKey: ['studentAssignments', studentId],
		queryFn: async () => {
			try {
				const { data } = await axios.get(
					`/api/assignments/student/${studentId}`
				);
				return data.data;
			} catch (error) {
				console.error('Failed to fetch assignments:', error);
				return [];
			}
		},
		enabled: !!studentId,
	});

	// Fetch resources
	const { data: resources } = useQuery({
		queryKey: ['studentResources', studentId],
		queryFn: async () => {
			try {
				const { data } = await axios.get(
					`/api/resources/student/${studentId}`
				);
				return data.data;
			} catch (error) {
				console.error('Failed to fetch resources:', error);
				return [];
			}
		},
		enabled: !!studentId,
	});

	// Fetch grades
	// const { data: grades } = useQuery({
	// 	queryKey: ['studentGrades', schoolId, classDetails],
	// 	queryFn: async () => {
	// 		try {
	// 			const classId = classDetails?.class_id!;
	// 			const { data } = await axios.get(
	// 				`/api/resultd/${schoolId}/${classId}`
	// 			);
	// 			return data.data.data.subjectsWithScores;
	// 		} catch (error) {
	// 			console.error('Failed to fetch grades:', error);
	// 			return [];
	// 		}
	// 	},
	// 	enabled: !!schoolId && !!classDetails,
	// });

	// Use API data or fallback to defaults
	const actualClassDetails = classDetails;
	const actualSubjects = subjects;
	const actualAssignments = assignments;
	const actualResources = resources;
	// const actualGrades = grades;

	// Helper functions
	const getSubjectAssignments = (subjectId: string): Assignment[] => {
		return actualAssignments.filter(
			(assignment: Assignment) => assignment.subject_id === subjectId
		);
	};

	const getSubjectResources = (subjectId: string): Resource[] => {
		return actualResources.filter(
			(resource: Resource) => resource.subject_id === subjectId
		);
	};

	// const getSubjectGrades = (subjectId: string): Grade[] => {
	// 	return actualGrades.filter((grade) => grade.subject_id === subjectId);
	// };

	// const getSubjectAverage = (subjectId: string): number => {
	// 	const subjectGrades = getSubjectGrades(subjectId);
	// 	if (subjectGrades.length === 0) return 0;
	// 	const total = subjectGrades.reduce(
	// 		(sum, grade) => sum + (grade.grade / grade.max_grade) * 100,
	// 		0
	// 	);
	// 	return Math.round(total / subjectGrades.length);
	// };

	const getFileIcon = (type: string) => {
		switch (type) {
			case 'pdf':
				return '📄';
			case 'doc':
				return '📝';
			case 'ppt':
				return '📊';
			case 'video':
				return '🎥';
			case 'link':
				return '🔗';
			default:
				return '📁';
		}
	};

	const isLoading = classLoading || subjectsLoading;

	if (isLoading) {
		return (
			<div className='p-6 max-w-7xl mx-auto'>
				<div className='flex items-center justify-center h-64'>
					<div className='text-center'>
						<div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
						<p className='text-muted-foreground'>
							Loading subjects...
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 max-w-7xl mx-auto space-y-6'>
			{/* Header */}
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-bold'>My Subjects</h1>
					<p className='text-muted-foreground'>
						{actualClassDetails.name} -{' '}
						{actualClassDetails.grade_level}
					</p>
				</div>
				<div className='text-right'>
					<p className='text-sm text-muted-foreground'>
						Total Subjects
					</p>
					<p className='text-2xl font-bold'>
						{actualSubjects.length}
					</p>
				</div>
			</div>

			{/* Subjects Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{actualSubjects.map((subject: Subject) => {
					// const average = getSubjectAverage(subject.subject_id);
					const subjectAssignments = getSubjectAssignments(
						subject.subject_id
					);
					const pendingAssignments = subjectAssignments.filter(
						(a) => a.status === 'pending'
					).length;

					return (
						<Card
							key={subject.subject_id}
							className='hover:shadow-lg transition-shadow'
						>
							<CardHeader className='pb-3'>
								<div className='flex items-start justify-between'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
											<BookOpen className='h-5 w-5 text-primary' />
										</div>
										<div>
											<CardTitle className='text-lg'>
												{subject.name}
											</CardTitle>
											<Badge variant='outline'>
												{subject.short}
											</Badge>
										</div>
									</div>
									{/* <div className='text-right'>
										<p className='text-xs text-muted-foreground'>
											Average
										</p>
										<p className='text-lg font-semibold text-primary'>
											{average}%
										</p>
									</div> */}
								</div>
							</CardHeader>
							<CardContent className='space-y-4'>
								{/* Teacher Info */}
								<div className='flex items-center gap-2'>
									<Avatar className='h-8 w-8'>
										<AvatarFallback className='text-xs'>
											{subject.teacher_name ||
												subject?.teacher?.username
													.split(' ')
													.map((n) => n[0])
													.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium text-sm'>
											{subject.teacher_name
												? subject.teacher_name
												: subject?.teacher?.username}
										</p>
										<p className='text-xs text-muted-foreground'>
											{subject.credits || 1} Credits
										</p>
									</div>
								</div>

								{/* Quick Stats */}
								<div className='grid grid-cols-2 gap-4 text-center'>
									<div className='bg-muted/30 rounded-lg p-2'>
										<p className='text-xs text-muted-foreground'>
											Pending
										</p>
										<p className='font-semibold'>
											{pendingAssignments}
										</p>
									</div>
									<div className='bg-muted/30 rounded-lg p-2'>
										<p className='text-xs text-muted-foreground'>
											Schedule
										</p>
										<p className='font-semibold'>
											{subject.schedule?.length || 0}/week
										</p>
									</div>
								</div>

								{/* Subject Description */}
								<p className='text-sm text-muted-foreground line-clamp-2'>
									{subject.description ||
										'No description available'}
								</p>

								{/* Action Buttons */}
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
										className='flex-1'
									>
										<Mail className='h-4 w-4 mr-1' />
										Contact
									</Button>
									<Button
										size='sm'
										className='flex-1'
									>
										View Details
										<ChevronRight className='h-4 w-4 ml-1' />
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Detailed Subject View */}
			<Card>
				<CardHeader>
					<CardTitle>Subject Details</CardTitle>
					<p className='text-muted-foreground'>
						Select a subject to view detailed information
					</p>
				</CardHeader>
				<CardContent>
					<Tabs
						defaultValue={
							actualSubjects[0]?.name
								.toLowerCase()
								.replace(/\s+/g, '') || 'mathematics'
						}
						className='w-full'
					>
						<TabsList className='grid w-full grid-cols-5'>
							{actualSubjects
								.slice(0, 5)
								.map((subject: Subject) => (
									<TabsTrigger
										key={subject.subject_id}
										value={subject.name
											.toLowerCase()
											.replace(/\s+/g, '')}
									>
										{subject.short}
									</TabsTrigger>
								))}
						</TabsList>

						{actualSubjects.map((subject: Subject) => (
							<TabsContent
								key={subject.subject_id}
								value={subject.name
									.toLowerCase()
									.replace(/\s+/g, '')}
								className='space-y-6'
							>
								{/* Subject Header */}
								<div className='flex items-start justify-between'>
									<div>
										<h2 className='text-2xl font-bold'>
											{subject.name}
										</h2>
										<p className='text-muted-foreground mt-1'>
											{subject.description ||
												'No description available'}
										</p>
									</div>
									{/* <div className='text-right'>
										<p className='text-sm text-muted-foreground'>
											Current Average
										</p>
										<div className='flex items-center gap-2'>
											<Star className='h-5 w-5 text-yellow-500' />
											<span className='text-2xl font-bold'>
												{getSubjectAverage(
													subject.subject_id
												)}
												%
											</span>
										</div>
									</div> */}
								</div>

								<Separator />

								<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
									{/* Left Column */}
									<div className='lg:col-span-2 space-y-6'>
										{/* Assignments */}
										<div>
											<h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
												<FileText className='h-5 w-5' />
												Assignments
											</h3>
											<div className='space-y-3'>
												{getSubjectAssignments(
													subject.subject_id
												).map((assignment) => (
													<div
														key={assignment.id}
														className='flex items-center justify-between p-3 border rounded-lg'
													>
														<div className='flex items-center gap-3'>
															{assignment.status ===
															'graded' ? (
																<CheckCircle className='h-5 w-5 text-green-500' />
															) : assignment.status ===
															  'submitted' ? (
																<Clock className='h-5 w-5 text-blue-500' />
															) : (
																<AlertCircle className='h-5 w-5 text-orange-500' />
															)}
															<div>
																<h4 className='font-medium'>
																	{
																		assignment.title
																	}
																</h4>
																<p className='text-sm text-muted-foreground'>
																	Due:{' '}
																	{new Date(
																		assignment.due_date
																	).toLocaleDateString()}
																</p>
															</div>
														</div>
														<div className='text-right'>
															<Badge
																variant={
																	assignment.status ===
																	'graded'
																		? 'default'
																		: assignment.status ===
																		  'submitted'
																		? 'secondary'
																		: 'destructive'
																}
															>
																{
																	assignment.status
																}
															</Badge>
															{assignment.grade && (
																<p className='text-sm font-medium mt-1'>
																	{
																		assignment.grade
																	}
																	/
																	{
																		assignment.max_grade
																	}
																</p>
															)}
														</div>
													</div>
												))}
												{getSubjectAssignments(
													subject.subject_id
												).length === 0 && (
													<p className='text-muted-foreground text-sm text-center py-4'>
														No assignments available
													</p>
												)}
											</div>
										</div>

										{/* Resources */}
										<div>
											<h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
												<Download className='h-5 w-5' />
												Study Materials
											</h3>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
												{getSubjectResources(
													subject.subject_id
												).map((resource) => (
													<div
														key={resource.id}
														className='flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors'
													>
														<span className='text-2xl'>
															{getFileIcon(
																resource.type
															)}
														</span>
														<div className='flex-1'>
															<h4 className='font-medium text-sm'>
																{resource.title}
															</h4>
															<p className='text-xs text-muted-foreground'>
																{resource.size}{' '}
																•{' '}
																{new Date(
																	resource.uploaded_date
																).toLocaleDateString()}
															</p>
														</div>
														<Button
															variant='ghost'
															size='sm'
														>
															<Download className='h-4 w-4' />
														</Button>
													</div>
												))}
												{getSubjectResources(
													subject.subject_id
												).length === 0 && (
													<p className='text-muted-foreground text-sm text-center py-4 col-span-2'>
														No resources available
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Right Column */}
									<div className='space-y-6'>
										{/* Teacher Info */}
										<Card>
											<CardHeader>
												<CardTitle className='text-lg flex items-center gap-2'>
													<User className='h-5 w-5' />
													Teacher
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='flex items-center gap-3 mb-4'>
													<Avatar>
														<AvatarFallback>
															{subject.teacher_name
																? subject.teacher_name
																: subject?.teacher?.username

																		.split(
																			' '
																		)
																		.map(
																			(
																				n
																			) =>
																				n[0]
																		)
																		.join(
																			''
																		)}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-medium'>
															{subject.teacher_name
																? subject.teacher_name
																: subject
																		?.teacher
																		?.username}
														</p>
														<p className='text-sm text-muted-foreground'>
															{subject?.teacher
																?.email ||
																'No email available'}
														</p>
													</div>
												</div>
												<Button
													variant='outline'
													className='w-full'
												>
													<Mail className='h-4 w-4 mr-2' />
													Send Message
												</Button>
											</CardContent>
										</Card>

										{/* Schedule */}
										<Card>
											<CardHeader>
												<CardTitle className='text-lg flex items-center gap-2'>
													<Calendar className='h-5 w-5' />
													Class Schedule
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='space-y-3'>
													{subject.schedule?.map(
														(schedule, index) => (
															<div
																key={index}
																className='border-l-4 border-primary pl-3'
															>
																<p className='font-medium text-sm'>
																	{
																		schedule.day
																	}
																</p>
																<p className='text-xs text-muted-foreground'>
																	{
																		schedule.time
																	}
																</p>
																<p className='text-xs text-muted-foreground'>
																	{
																		schedule.room
																	}
																</p>
															</div>
														)
													)}
													{(!subject.schedule ||
														subject.schedule
															.length === 0) && (
														<p className='text-muted-foreground text-sm'>
															No schedule
															available
														</p>
													)}
												</div>
											</CardContent>
										</Card>

										{/* Recent Grades */}
										<Card>
											<CardHeader>
												<CardTitle className='text-lg flex items-center gap-2'>
													<Award className='h-5 w-5' />
													Recent Grades
												</CardTitle>
											</CardHeader>
											<CardContent>
												{/* <div className='space-y-3'>
													{getSubjectGrades(
														subject.subject_id
													)
														.slice(0, 3)
														.map((grade) => (
															<div
																key={grade.id}
																className='flex items-center justify-between'
															>
																<div>
																	<p className='font-medium text-sm'>
																		{
																			grade.assessment_name
																		}
																	</p>
																	<p className='text-xs text-muted-foreground capitalize'>
																		{
																			grade.type
																		}
																	</p>
																</div>
																<div className='text-right'>
																	<p className='font-semibold'>
																		{
																			grade.grade
																		}
																		/
																		{
																			grade.max_grade
																		}
																	</p>
																	<p className='text-xs text-muted-foreground'>
																		{Math.round(
																			(grade.grade /
																				grade.max_grade) *
																				100
																		)}
																		%
																	</p>
																</div>
															</div>
														))}
													{getSubjectGrades(
														subject.subject_id
													).length === 0 && (
														<p className='text-muted-foreground text-sm'>
															No grades available
														</p>
													)}
												</div> */}
												<Button
													variant='outline'
													className='w-full mt-4'
												>
													View All Grades
												</Button>
											</CardContent>
										</Card>
									</div>
								</div>
							</TabsContent>
						))}
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}
