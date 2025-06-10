import React from 'react';
import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2, Pencil, MoreVertical, Settings, Eye } from 'lucide-react';
import { Subject } from './SubjectForm';

interface SubjectTableRowProps {
	subject: Subject;
	onEdit: (subject: Subject) => void;
	onSettings: (subject: Subject) => void;
	onDelete: (subjectId: string) => void;
	isDeleting: boolean;
}

export const SubjectTableRow: React.FC<SubjectTableRowProps> = ({
	subject,
	onEdit,
	onSettings,
	onDelete,
	isDeleting,
}) => {
	const router = useRouter();

	const handleRowClick = () => {
		router.push(
			`/classes/${
				subject.class_id
			}/students?subjectName=${encodeURIComponent(
				subject.name
			)}&subjectId=${subject.subject_id}`
		);
	};

	return (
		<TableRow className='cursor-pointer'>
			<TableCell onClick={handleRowClick}>{subject.name}</TableCell>
			<TableCell onClick={handleRowClick}>
				{subject?.class?.grade_level}
			</TableCell>
			<TableCell onClick={handleRowClick}>
				{subject?.class?.name}
			</TableCell>
			<TableCell>
				<Badge variant={subject.is_approved ? 'default' : 'secondary'}>
					{subject.is_approved ? 'Approved' : 'Pending'}
				</Badge>
			</TableCell>
			<TableCell>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
						>
							<MoreVertical className='w-4 h-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem onClick={handleRowClick}>
							<Eye className='w-4 h-4 mr-2' /> View
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onEdit(subject)}>
							<Pencil className='w-4 h-4 mr-2' /> Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => onSettings(subject)}>
							<Settings className='w-4 h-4 mr-2' /> Settings
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(subject.subject_id)}
							className='text-red-600'
							disabled={isDeleting}
						>
							<Trash2 className='w-4 h-4 mr-2' />
							{isDeleting ? 'Deleting...' : 'Delete'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
};
