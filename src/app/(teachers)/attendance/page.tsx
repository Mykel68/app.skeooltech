'use client';

import { useUserStore } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';

export default function AttendancePage() {
	const schoolId = useUserStore((s) => s.schoolId);
	const sessionId = useUserStore((s) => s.session_id);
	const termId = useUserStore((s) => s.term_id);
	const teacherId = useUserStore((s) => s.userId);

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
				`/api/class-teacher/get-class/${schoolId}/${sessionId}/${termId}/${teacherId}`
			);
			return response.data.data.data; // extract only the inner data
		},
		enabled: !!schoolId && !!sessionId && !!termId && !!teacherId,
	});

	if (isLoading) return <p className='p-4'>Loading attendance info…</p>;
	if (error)
		return <p className='p-4 text-destructive'>Error: {`${error}`}</p>;
	if (!data) return <p className='p-4'>No data available.</p>;

	const { classDetails, students } = data;

	return (
		<div className='p-4'>
			<h2 className='text-lg font-semibold mb-2'>
				Attendance for {classDetails.class.name}
			</h2>
			<ul className='space-y-1'>
				{students.map((student: any) => (
					<li
						key={student.user_id}
						className='border p-2 rounded-md'
					>
						{student.first_name} {student.last_name} –{' '}
						{student.email}
					</li>
				))}
			</ul>
		</div>
	);
}
