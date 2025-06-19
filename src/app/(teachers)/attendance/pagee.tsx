'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

type Student = {
	id: string;
	first_name: string;
	last_name: string;
};

type AttendanceFormProps = {
	classId: string;
	termId: string;
	totalDays: number;
	students: Student[];
};

export default function AttendanceForm({
	classId,
	termId,
	totalDays,
	students,
}: AttendanceFormProps) {
	const { register, handleSubmit, control } = useForm({
		defaultValues: {
			attendance: students.map((s) => ({
				student_id: s.id,
				present_days: '',
			})),
		},
	});
	const { fields } = useFieldArray({ control, name: 'attendance' });
	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			await axios.post('/api/attendance/submit', {
				class_id: classId,
				term_id: termId,
				total_days: totalDays,
				records: data.attendance,
			});
			toast.success('Attendance saved');
		} catch (error) {
			console.error(error);
			toast.error('Failed to save attendance');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className='max-w-5xl mx-auto mt-6 rounded-2xl shadow-sm'>
			<CardHeader>
				<CardTitle className='text-lg font-bold'>
					Mark Attendance ({totalDays} total days)
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Days Present</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{fields.map((field, index) => (
								<TableRow key={field.id}>
									<TableCell>
										{students[index].first_name}{' '}
										{students[index].last_name}
									</TableCell>
									<TableCell>
										<Input
											type='number'
											{...register(
												`attendance.${index}.present_days`,
												{
													required: true,
													min: 0,
													max: totalDays,
												}
											)}
											placeholder={`0-${totalDays}`}
											className='w-24'
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Button
						type='submit'
						disabled={loading}
					>
						{loading ? 'Saving...' : 'Submit Attendance'}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
