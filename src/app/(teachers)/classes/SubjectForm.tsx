import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const subjectSchema = z.object({
	class_id: z.string().min(1, 'Class is required'),
	name: z.string().min(2, 'Subject name is required'),
	short: z.string().min(1, 'Subject code is required'),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;

export type SchoolClass = {
	class_id: string;
	name: string;
	grade_level: string;
};

export type Subject = {
	subject_id: string;
	name: string;
	short: string;
	class_id: string;
	class_name: string;
	grade_level: string;
	teacher_name: string;
	teacher_email: string;
	is_approved: boolean;
};

interface SubjectFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editMode: boolean;
	editingSubject: Subject | null;
	classes: SchoolClass[];
	onSubmit: (values: SubjectFormValues) => void;
	isSubmitting: boolean;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
	open,
	onOpenChange,
	editMode,
	editingSubject,
	classes,
	onSubmit,
	isSubmitting,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<SubjectFormValues>({
		resolver: zodResolver(subjectSchema),
	});

	React.useEffect(() => {
		if (editingSubject && editMode) {
			setValue('name', editingSubject.name);
			setValue('short', editingSubject.short);
			setValue('class_id', editingSubject.class_id);
		}
	}, [editingSubject, editMode, setValue]);

	const handleClose = () => {
		onOpenChange(false);
		reset();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4'
				>
					<DialogHeader>
						<DialogTitle>
							{editMode ? 'Edit Subject' : 'Create Subject'}
							<DialogDescription className='font-medium tracking-[.04em] mt-2'>
								You're creating subject in the selected session
								and term of the school
							</DialogDescription>
						</DialogTitle>
					</DialogHeader>

					<Select
						onValueChange={(value) => setValue('class_id', value)}
						defaultValue={editingSubject?.class_id}
					>
						<SelectTrigger
							className='w-full'
							disabled={!classes.length}
						>
							<SelectValue placeholder='Select Class' />
						</SelectTrigger>
						<SelectContent>
							{classes.map((c) => (
								<SelectItem
									key={c.class_id}
									value={c.class_id}
								>
									{c.name} ({c.grade_level})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.class_id && (
						<p className='text-sm text-red-500'>
							{errors.class_id.message}
						</p>
					)}

					<Input
						placeholder='Subject Name'
						{...register('name')}
					/>
					{errors.name && (
						<p className='text-sm text-red-500'>
							{errors.name.message}
						</p>
					)}

					<Input
						placeholder='Subject Code'
						{...register('short')}
					/>
					{errors.short && (
						<p className='text-sm text-red-500'>
							{errors.short.message}
						</p>
					)}

					<DialogFooter>
						<Button
							type='button'
							variant='ghost'
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<div className='flex items-center gap-2'>
									<div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
									{editMode ? 'Updating...' : 'Creating...'}
								</div>
							) : editMode ? (
								'Update'
							) : (
								'Create'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
