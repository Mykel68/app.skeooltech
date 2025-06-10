'use client';
import {
	useForm,
	UseFormRegister,
	Control,
	FieldErrors,
} from 'react-hook-form';

import React from 'react';
import {
	Table,
	TableHeader,
	TableRow,
	TableCell,
	TableBody,
} from '@/components/ui/table';
import { StudentScoreRow } from './StudentScoreRow';

interface GradingComponent {
	name: string;
	weight: number;
}

interface Student {
	user_id: string;
	first_name: string;
	last_name: string;
	scores?: { component_name: string; score: number }[];
}

interface Props {
	students: Student[];
	gradingComponents: GradingComponent[];
	onStudentClick?: (student: Student) => void;
	register: UseFormRegister<any>;
	control: Control<any>;
	errors: FieldErrors;
}

export const GradingTable = ({
	students,
	gradingComponents,
	onStudentClick,
	register,
	control,
	errors,
}: Props) => {
	return (
		<div className='overflow-x-auto'>
			<Table>
				<TableHeader>
					<TableRow className='h-[1.1rem]'>
						<TableCell>First Name</TableCell>
						<TableCell>Last Name</TableCell>
						{gradingComponents.map((comp) => (
							<TableCell key={comp.name}>
								{comp.name} ({comp.weight}%)
							</TableCell>
						))}
						<TableCell>Total</TableCell>
					</TableRow>
				</TableHeader>

				<TableBody>
					{students.map((student) => (
						<StudentScoreRow
							key={student.user_id}
							student={student}
							gradingComponents={gradingComponents}
							onClick={onStudentClick}
							register={register}
							control={control}
							errors={errors}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
