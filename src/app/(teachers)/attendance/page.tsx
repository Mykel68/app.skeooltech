'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	Calendar,
	Users,
	CheckCircle,
	XCircle,
	Clock,
	Search,
	Filter,
	Download,
	Plus,
	Edit3,
	Save,
	X,
} from 'lucide-react';

// Mock API functions (replace with actual API calls)
const fetchStudents = async (classId) => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));

	return [
		{
			id: 1,
			name: 'John Doe',
			rollNumber: '001',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 165,
			absentDays: 15,
		},
		{
			id: 2,
			name: 'Jane Smith',
			rollNumber: '002',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 172,
			absentDays: 8,
		},
		{
			id: 3,
			name: 'Mike Johnson',
			rollNumber: '003',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 158,
			absentDays: 22,
		},
		{
			id: 4,
			name: 'Sarah Wilson',
			rollNumber: '004',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 178,
			absentDays: 2,
		},
		{
			id: 5,
			name: 'David Brown',
			rollNumber: '005',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 145,
			absentDays: 35,
		},
		{
			id: 6,
			name: 'Emma Davis',
			rollNumber: '006',
			class: 'Grade 10A',
			totalDays: 180,
			presentDays: 170,
			absentDays: 10,
		},
	];
};

const fetchClasses = async () => {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return [
		{ id: 1, name: 'Grade 10A', students: 25 },
		{ id: 2, name: 'Grade 10B', students: 28 },
		{ id: 3, name: 'Grade 11A', students: 22 },
		{ id: 4, name: 'Grade 11B', students: 26 },
	];
};

const updateAttendance = async ({ studentId, presentDays, absentDays }) => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return { success: true, studentId, presentDays, absentDays };
};

export default function AttendancePage() {
	const [selectedClass, setSelectedClass] = useState(1);
	const [searchTerm, setSearchTerm] = useState('');
	const [editingStudent, setEditingStudent] = useState(null);
	const [editForm, setEditForm] = useState({ presentDays: 0, absentDays: 0 });

	const queryClient = useQueryClient();

	// Fetch classes
	const { data: classes = [], isLoading: classesLoading } = useQuery({
		queryKey: ['classes'],
		queryFn: fetchClasses,
	});

	// Fetch students for selected class
	const {
		data: students = [],
		isLoading: studentsLoading,
		refetch,
	} = useQuery({
		queryKey: ['students', selectedClass],
		queryFn: () => fetchStudents(selectedClass),
		enabled: !!selectedClass,
	});

	// Update attendance mutation
	const updateAttendanceMutation = useMutation({
		mutationFn: updateAttendance,
		onSuccess: () => {
			queryClient.invalidateQueries(['students', selectedClass]);
			setEditingStudent(null);
			// You can add a toast notification here
		},
	});

	// Filter students based on search
	const filteredStudents = students.filter(
		(student) =>
			student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.rollNumber.includes(searchTerm)
	);

	const handleEditStart = (student) => {
		setEditingStudent(student.id);
		setEditForm({
			presentDays: student.presentDays,
			absentDays: student.absentDays,
		});
	};

	const handleEditSave = (studentId) => {
		const totalDays = editForm.presentDays + editForm.absentDays;
		if (totalDays > 200) {
			alert('Total days cannot exceed 200');
			return;
		}

		updateAttendanceMutation.mutate({
			studentId,
			presentDays: editForm.presentDays,
			absentDays: editForm.absentDays,
		});
	};

	const handleEditCancel = () => {
		setEditingStudent(null);
		setEditForm({ presentDays: 0, absentDays: 0 });
	};

	const getAttendancePercentage = (present, total) => {
		return total > 0 ? ((present / total) * 100).toFixed(1) : 0;
	};

	const getAttendanceStatus = (percentage) => {
		if (percentage >= 90)
			return { color: 'text-green-600 bg-green-100', label: 'Excellent' };
		if (percentage >= 75)
			return { color: 'text-blue-600 bg-blue-100', label: 'Good' };
		if (percentage >= 60)
			return { color: 'text-yellow-600 bg-yellow-100', label: 'Average' };
		return { color: 'text-red-600 bg-red-100', label: 'Poor' };
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold text-gray-900'>
						Attendance Management
					</h1>
					<p className='text-gray-600 mt-1'>
						Track and manage student attendance records
					</p>
				</div>

				<div className='flex items-center gap-3'>
					<button className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'>
						<Download className='w-4 h-4' />
						Export Report
					</button>
					<button className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
						<Plus className='w-4 h-4' />
						Mark Today's Attendance
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600'>
								Total Students
							</p>
							<p className='text-2xl font-bold text-gray-900'>
								{students.length}
							</p>
						</div>
						<div className='p-3 bg-blue-100 rounded-lg'>
							<Users className='w-6 h-6 text-blue-600' />
						</div>
					</div>
				</div>

				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600'>
								Average Attendance
							</p>
							<p className='text-2xl font-bold text-green-600'>
								{students.length > 0
									? (
											students.reduce(
												(acc, student) =>
													acc +
													getAttendancePercentage(
														student.presentDays,
														student.totalDays
													),
												0
											) / students.length
									  ).toFixed(1)
									: 0}
								%
							</p>
						</div>
						<div className='p-3 bg-green-100 rounded-lg'>
							<CheckCircle className='w-6 h-6 text-green-600' />
						</div>
					</div>
				</div>

				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600'>
								Present Today
							</p>
							<p className='text-2xl font-bold text-blue-600'>
								{Math.floor(students.length * 0.85)}
							</p>
						</div>
						<div className='p-3 bg-blue-100 rounded-lg'>
							<Clock className='w-6 h-6 text-blue-600' />
						</div>
					</div>
				</div>

				<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-600'>
								Absent Today
							</p>
							<p className='text-2xl font-bold text-red-600'>
								{students.length -
									Math.floor(students.length * 0.85)}
							</p>
						</div>
						<div className='p-3 bg-red-100 rounded-lg'>
							<XCircle className='w-6 h-6 text-red-600' />
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
				<div className='flex flex-col lg:flex-row gap-4'>
					<div className='flex-1'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Select Class
						</label>
						<select
							value={selectedClass}
							onChange={(e) =>
								setSelectedClass(Number(e.target.value))
							}
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							disabled={classesLoading}
						>
							{classes.map((cls) => (
								<option
									key={cls.id}
									value={cls.id}
								>
									{cls.name} ({cls.students} students)
								</option>
							))}
						</select>
					</div>

					<div className='flex-1'>
						<label className='block text-sm font-medium text-gray-700 mb-2'>
							Search Students
						</label>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
							<input
								type='text'
								placeholder='Search by name or roll number...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>
					</div>

					<div className='flex items-end'>
						<button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
							<Filter className='w-4 h-4' />
							Filter
						</button>
					</div>
				</div>
			</div>

			{/* Students Table */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-semibold text-gray-900'>
						Student Attendance Records
					</h2>
				</div>

				{studentsLoading ? (
					<div className='p-8 text-center'>
						<div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
						<p className='mt-2 text-gray-600'>
							Loading students...
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Student
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Roll Number
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Total Days
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Present Days
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Absent Days
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Attendance %
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Status
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredStudents.map((student) => {
									const percentage = getAttendancePercentage(
										student.presentDays,
										student.totalDays
									);
									const status =
										getAttendanceStatus(percentage);
									const isEditing =
										editingStudent === student.id;

									return (
										<tr
											key={student.id}
											className='hover:bg-gray-50'
										>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='flex-shrink-0 h-10 w-10'>
														<div className='h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center'>
															<span className='text-sm font-medium text-blue-600'>
																{student.name
																	.split(' ')
																	.map(
																		(n) =>
																			n[0]
																	)
																	.join('')}
															</span>
														</div>
													</div>
													<div className='ml-4'>
														<div className='text-sm font-medium text-gray-900'>
															{student.name}
														</div>
														<div className='text-sm text-gray-500'>
															{student.class}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{student.rollNumber}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{student.totalDays}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{isEditing ? (
													<input
														type='number'
														value={
															editForm.presentDays
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																presentDays:
																	Number(
																		e.target
																			.value
																	),
															})
														}
														className='w-20 px-2 py-1 border border-gray-300 rounded text-center'
														min='0'
														max='200'
													/>
												) : (
													<span className='text-green-600 font-semibold'>
														{student.presentDays}
													</span>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												{isEditing ? (
													<input
														type='number'
														value={
															editForm.absentDays
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																absentDays:
																	Number(
																		e.target
																			.value
																	),
															})
														}
														className='w-20 px-2 py-1 border border-gray-300 rounded text-center'
														min='0'
														max='200'
													/>
												) : (
													<span className='text-red-600 font-semibold'>
														{student.absentDays}
													</span>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
												<div className='flex items-center'>
													<div className='w-16 bg-gray-200 rounded-full h-2 mr-2'>
														<div
															className='bg-blue-600 h-2 rounded-full'
															style={{
																width: `${Math.min(
																	percentage,
																	100
																)}%`,
															}}
														></div>
													</div>
													<span className='font-semibold'>
														{percentage}%
													</span>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
												>
													{status.label}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
												{isEditing ? (
													<div className='flex items-center gap-2'>
														<button
															onClick={() =>
																handleEditSave(
																	student.id
																)
															}
															disabled={
																updateAttendanceMutation.isPending
															}
															className='text-green-600 hover:text-green-900 disabled:opacity-50'
														>
															<Save className='w-4 h-4' />
														</button>
														<button
															onClick={
																handleEditCancel
															}
															className='text-gray-600 hover:text-gray-900'
														>
															<X className='w-4 h-4' />
														</button>
													</div>
												) : (
													<button
														onClick={() =>
															handleEditStart(
																student
															)
														}
														className='text-blue-600 hover:text-blue-900'
													>
														<Edit3 className='w-4 h-4' />
													</button>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{filteredStudents.length === 0 && !studentsLoading && (
					<div className='p-8 text-center'>
						<Users className='mx-auto h-12 w-12 text-gray-400' />
						<h3 className='mt-2 text-sm font-medium text-gray-900'>
							No students found
						</h3>
						<p className='mt-1 text-sm text-gray-500'>
							Try adjusting your search criteria or select a
							different class.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
