'use client';
import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import {
	Calendar,
	Users,
	BookOpen,
	AlertCircle,
	UserCheck,
	CheckCircle,
} from 'lucide-react';

interface Student {
	user_id: string;
	first_name: string;
	last_name: string;
	email: string;
	student_id?: string;
}

interface AttendanceRecord {
	student_id: string;
	days_attended: number;
}

export default function AttendancePage() {
	const schoolId = useUserStore((s) => s.schoolId);
	const sessionId = useUserStore((s) => s.session_id);
	const termId = useUserStore((s) => s.term_id);
	const teacherId = useUserStore((s) => s.userId);

	const [attendanceRecords, setAttendanceRecords] = useState<
		Record<string, number>
	>({});
	const [totalSchoolDays, setTotalSchoolDays] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const { data, isLoading, error } = useQuery({
		queryKey: [
			'get-teacher-classes',
			schoolId,
			sessionId,
			termId,
			teacherId,
		],
		queryFn: async () => {
			const response = await axios.get(
				`/api/class-teacher/atttendance/${schoolId}/${sessionId}/${termId}/${teacherId}`
			);
			setTotalSchoolDays(response.data.data.data.total_school_days);
			return response.data.data.data;
		},
		enabled: !!schoolId && !!sessionId && !!termId && !!teacherId,
	});

	const handleAttendanceChange = (studentId: string, days: string) => {
		const numDays = parseInt(days) || 0;
		setAttendanceRecords((prev) => ({
			...prev,
			[studentId]: numDays,
		}));
	};

	const handleSubmitAttendance = async () => {
		setIsSubmitting(true);
		try {
			const attendanceData = Object.entries(attendanceRecords).map(
				([studentId, daysAttended]) => ({
					student_id: studentId,
					days_attended: daysAttended,
					total_school_days: totalSchoolDays,
				})
			);

			// Replace with your actual API endpoint
			await axios.post('/api/attendance/submit-bulk', {
				class_id: data?.classDetails?.class?.id,
				attendance: attendanceData,
				total_school_days: totalSchoolDays,
				session_id: sessionId,
				term_id: termId,
			});

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);
		} catch (error) {
			console.error('Failed to submit attendance:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getAttendanceStats = () => {
		const students = data?.students || [];
		const totalStudents = students.length;
		const recordedStudents = Object.keys(attendanceRecords).length;
		const totalDaysRecorded = Object.values(attendanceRecords).reduce(
			(sum, days) => sum + days,
			0
		);
		const averageAttendance =
			recordedStudents > 0
				? (totalDaysRecorded / recordedStudents).toFixed(1)
				: '0';

		return {
			totalStudents,
			recordedStudents,
			totalDaysRecorded,
			averageAttendance,
		};
	};

	// Loading State
	if (isLoading) {
		return (
			<div className='min-h-screen px-10 '>
				<div className=' mx-auto'>
					<div className='bg-white rounded-lg shadow-sm border p-8'>
						<div className='animate-pulse'>
							<div className='flex items-center space-x-4 mb-6'>
								<div className='w-8 h-8 bg-gray-200 rounded-full'></div>
								<div className='h-6 bg-gray-200 rounded w-64'></div>
							</div>
							<div className='space-y-4'>
								{[...Array(8)].map((_, i) => (
									<div
										key={i}
										className='flex items-center space-x-4 p-4 border rounded-lg'
									>
										<div className='w-10 h-10 bg-gray-200 rounded-full'></div>
										<div className='flex-1'>
											<div className='h-4 bg-gray-200 rounded w-1/3 mb-2'></div>
											<div className='h-3 bg-gray-200 rounded w-1/2'></div>
										</div>
										<div className='w-20 h-10 bg-gray-200 rounded'></div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Error State
	if (error) {
		return (
			<div className='min-h-screen px-10 '>
				<div className=' mx-auto'>
					<div className='bg-white rounded-lg shadow-sm border p-8 text-center'>
						<AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
						<h2 className='text-xl font-semibold text-gray-900 mb-2'>
							Error Loading Attendance
						</h2>
						<p className='text-gray-600 mb-4'>
							Unable to load attendance information. Please try
							again.
						</p>
						<p className='text-sm text-red-600 bg-red-50 p-3 rounded border'>
							{error.message || 'An unexpected error occurred'}
						</p>
						<button
							onClick={() => window.location.reload()}
							className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Empty State (No class assigned)
	if (
		!data ||
		!data.classDetails ||
		!data.students ||
		data.students.length === 0
	) {
		return (
			<div className='min-h-screen px-10 '>
				<div className=' mx-auto'>
					<div className='bg-white rounded-lg shadow-sm border p-12 text-center'>
						<UserCheck className='w-20 h-20 text-gray-400 mx-auto mb-6' />
						<h2 className='text-2xl font-semibold text-gray-900 mb-3'>
							No Class Assigned
						</h2>
						<p className='text-gray-600 mb-2'>
							You are not currently assigned as a class teacher
							for any class.
						</p>
						<p className='text-sm text-gray-500 mb-6'>
							Contact your administrator if you believe this is an
							error.
						</p>
						<div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto'>
							<h3 className='font-medium text-blue-900 mb-2'>
								What you can do:
							</h3>
							<ul className='text-sm text-blue-800 space-y-1'>
								<li>• Check with school administration</li>
								<li>
									• Verify your teacher profile is complete
								</li>
								<li>
									• Contact IT support if the issue persists
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const { classDetails, students } = data;
	const stats = getAttendanceStats();

	return (
		<div className='min-h-screen px-10 '>
			<div className=' mx-auto'>
				{/* Header */}
				<div className='bg-white rounded-lg shadow-sm border mb-6 p-6'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center space-x-3'>
							<BookOpen className='w-8 h-8 text-blue-600' />
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									{classDetails.class.name} Attendance Record
								</h1>
								<p className='text-gray-600'>
									{students.length} students • Session{' '}
									{sessionId} • Term {termId}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Total School Days Input */}
				<div className='bg-white rounded-lg shadow-sm border mb-6 p-6'>
					<div className='flex items-center space-x-4'>
						<Calendar className='w-6 h-6 text-blue-600' />
						<div className='flex-1'>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Total School Days This Term
							</label>
							<input
								type='number'
								min='0'
								max='200'
								value={totalSchoolDays}
								// onChange={(e) =>
								// 	setTotalSchoolDays(
								// 		parseInt(e.target.value) || 0
								// 	)
								// }
								placeholder='Enter total school days'
								className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>
						{/* <div className='text-sm text-gray-500'>
							<p>Set the total number of</p>
							<p>school days for reference</p>
						</div> */}
					</div>
				</div>

				{/* Stats Cards */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
					<div className='bg-white p-4 rounded-lg shadow-sm border'>
						<div className='flex items-center'>
							<Users className='w-5 h-5 text-gray-500 mr-2' />
							<div>
								<p className='text-sm text-gray-600'>
									Total Students
								</p>
								<p className='text-xl font-semibold'>
									{stats.totalStudents}
								</p>
							</div>
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg shadow-sm border'>
						<div className='flex items-center'>
							<CheckCircle className='w-5 h-5 text-green-500 mr-2' />
							<div>
								<p className='text-sm text-gray-600'>
									Recorded
								</p>
								<p className='text-xl font-semibold text-green-600'>
									{stats.recordedStudents}
								</p>
							</div>
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg shadow-sm border'>
						<div className='flex items-center'>
							<BookOpen className='w-5 h-5 text-blue-500 mr-2' />
							<div>
								<p className='text-sm text-gray-600'>
									Total Days
								</p>
								<p className='text-xl font-semibold text-blue-600'>
									{stats.totalDaysRecorded}
								</p>
							</div>
						</div>
					</div>
					<div className='bg-white p-4 rounded-lg shadow-sm border'>
						<div className='flex items-center'>
							<Calendar className='w-5 h-5 text-purple-500 mr-2' />
							<div>
								<p className='text-sm text-gray-600'>Average</p>
								<p className='text-xl font-semibold text-purple-600'>
									{stats.averageAttendance}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Attendance Input List */}
				<div className='bg-white rounded-lg shadow-sm border'>
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-lg font-semibold text-gray-900'>
							Enter Days Attended
						</h2>
						<p className='text-sm text-gray-600 mt-1'>
							Input the number of days each student attended
							school this term
						</p>
					</div>

					<div className='p-6'>
						<div className='space-y-3'>
							{students.map((student: Student, index) => (
								<div
									key={student.user_id}
									className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
								>
									<div className='flex items-center space-x-4'>
										<div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600'>
											{index + 1}
										</div>
										<div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
											<span className='text-blue-600 font-semibold text-sm'>
												{student.first_name[0]}
												{student.last_name[0]}
											</span>
										</div>
										<div className='flex-1'>
											<h3 className='font-medium text-gray-900'>
												{student.first_name}{' '}
												{student.last_name}
											</h3>
											<p className='text-sm text-gray-500'>
												{student.email}
											</p>
										</div>
									</div>

									<div className='flex items-center space-x-4'>
										<div className='flex items-center space-x-2'>
											<label className='text-sm font-medium text-gray-700'>
												Days attended:
											</label>
											<input
												type='number'
												min='0'
												max={totalSchoolDays || 200}
												value={
													attendanceRecords[
														student.user_id
													] || ''
												}
												onChange={(e) =>
													handleAttendanceChange(
														student.user_id,
														e.target.value
													)
												}
												placeholder='0'
												className='w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
											/>
										</div>
										{totalSchoolDays > 0 &&
											attendanceRecords[
												student.user_id
											] && (
												<div className='text-sm text-gray-500'>
													(
													{(
														(attendanceRecords[
															student.user_id
														] /
															totalSchoolDays) *
														100
													).toFixed(1)}
													%)
												</div>
											)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Submit Section */}
					<div className='p-6 border-t border-gray-200 bg-gray-50'>
						<div className='flex items-center justify-between'>
							<div className='text-sm text-gray-600'>
								Recorded: {stats.recordedStudents} of{' '}
								{stats.totalStudents} students
							</div>
							<div className='flex items-center space-x-3'>
								{submitSuccess && (
									<div className='flex items-center text-green-600 text-sm'>
										<CheckCircle className='w-4 h-4 mr-1' />
										Attendance saved successfully!
									</div>
								)}
								<button
									onClick={handleSubmitAttendance}
									disabled={
										stats.recordedStudents === 0 ||
										isSubmitting
									}
									className={`px-6 py-2 rounded-lg font-medium transition-colors ${
										stats.recordedStudents === 0 ||
										isSubmitting
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-blue-600 text-white hover:bg-blue-700'
									}`}
								>
									{isSubmitting
										? 'Saving...'
										: 'Save Attendance Records'}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
