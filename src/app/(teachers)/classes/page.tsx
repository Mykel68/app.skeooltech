'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import separated components
import { SubjectTableLoadingState } from './LoadingStates';
import { SubjectEmptyState } from './EmptyState';
import { SubjectErrorState } from './ErrorState';
import {
	SubjectForm,
	SubjectFormValues,
	Subject,
	SchoolClass,
} from './SubjectForm';
import { AssessmentSettingsDialog } from './SubjectSettingsDialog';
import { SubjectTableRow } from './SubjectTableRows';
import { useRouter } from 'next/navigation';

// API Functions
const fetchClasses = async (schoolId: string): Promise<SchoolClass[]> => {
	const { data } = await axios.get(`/api/class/get-all-class/${schoolId}`);
	return data.data.classes;
};

const fetchSubjects = async (
	schoolId: string,
	userId: string
): Promise<Subject[]> => {
	const { data } = await axios.get(`/api/subject/by-teacher/${userId}`);
	return data.data.subjects;
};

const createSubject = async (
	payload: SubjectFormValues & { schoolId: string }
) => {
	await axios.post(`/api/subject/create-new/${payload.class_id}`, {
		name: payload.name,
		short: payload.short,
	});
};

const updateSubject = async (
	payload: SubjectFormValues & { subject_id: string; schoolId: string }
) => {
	const { name, short, class_id, subject_id, schoolId } = payload;
	await axios.patch(`/api/subject/update/${schoolId}/${subject_id}`, {
		name,
		short,
		class_id,
	});
};

const deleteSubject = async ({
	subject_id,
	schoolId,
}: {
	subject_id: string;
	schoolId: string;
}) => {
	await axios.delete(`/api/subject/delete/${schoolId}/${subject_id}`);
};

export default function SubjectTable() {
	const router = useRouter();
	const schoolId = useUserStore((s) => s.schoolId)!;
	const userId = useUserStore((s) => s.userId)!;
	const queryClient = useQueryClient();

	// State management
	const [formOpen, setFormOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [settingsSubject, setSettingsSubject] = useState<Subject | null>(
		null
	);

	// Queries
	const {
		data: classes = [],
		isLoading: classesLoading,
		error: classesError,
	} = useQuery({
		queryKey: ['classes', schoolId],
		queryFn: () => fetchClasses(schoolId),
		enabled: !!schoolId,
	});

	const {
		data: subjects = [],
		isLoading: subjectsLoading,
		error: subjectsError,
		refetch: refetchSubjects,
	} = useQuery({
		queryKey: ['subjects', schoolId, userId],
		queryFn: () => fetchSubjects(schoolId, userId),
		enabled: !!schoolId && !!userId,
	});

	// Mutations
	const createMutation = useMutation({
		mutationFn: createSubject,
		onSuccess: () => {
			toast.success('Subject created!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
			handleFormClose();
		},
		onError: (err: any) =>
			toast.error(
				err.response?.data?.message || 'Failed to create subject'
			),
	});

	const updateMutation = useMutation({
		mutationFn: updateSubject,
		onSuccess: () => {
			toast.success('Subject updated!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
			handleFormClose();
		},
		onError: (err: any) =>
			toast.error(
				err.response?.data?.message || 'Failed to update subject'
			),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteSubject,
		onSuccess: () => {
			toast.success('Subject deleted!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
		},
		onError: (err: any) =>
			toast.error(
				err.response?.data?.message || 'Failed to delete subject'
			),
	});

	// Event handlers
	const handleFormSubmit = (values: SubjectFormValues) => {
		if (editMode && editingSubject) {
			updateMutation.mutate({
				...values,
				schoolId,
				subject_id: editingSubject.subject_id,
			});
		} else {
			createMutation.mutate({ ...values, schoolId });
		}
	};

	const handleFormClose = () => {
		setFormOpen(false);
		setEditMode(false);
		setEditingSubject(null);
	};

	const handleEdit = (subject: Subject) => {
		setEditingSubject(subject);
		setEditMode(true);
		setFormOpen(true);
	};

	const handleSettings = (subject: Subject) => {
		setSettingsSubject(subject);
		setSettingsOpen(true);
	};

	const handleDelete = (subjectId: string) => {
		deleteMutation.mutate({ subject_id: subjectId, schoolId });
	};

	const handleCreateClick = () => {
		setFormOpen(true);
	};

	const handleRetry = () => {
		refetchSubjects();
	};

	// Loading state
	if (subjectsLoading || classesLoading) {
		return (
			<div className='p-4'>
				<Card className='w-full'>
					<CardContent className='p-6'>
						<SubjectTableLoadingState />
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (subjectsError || classesError) {
		return (
			<div className='p-4'>
				<Card className='w-full'>
					<CardContent className='p-6'>
						<SubjectErrorState onRetry={handleRetry} />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<Card className='w-full'>
				<CardHeader className='flex justify-between items-center'>
					<CardTitle>Subjects</CardTitle>
					<Button
						onClick={handleCreateClick}
						className='gap-2'
					>
						<Plus className='w-4 h-4' />
						Create Subject
					</Button>
				</CardHeader>

				<CardContent>
					{/* Form Dialog */}
					<SubjectForm
						open={formOpen}
						onOpenChange={setFormOpen}
						editMode={editMode}
						editingSubject={editingSubject}
						classes={classes}
						onSubmit={handleFormSubmit}
						isSubmitting={
							createMutation.isPending || updateMutation.isPending
						}
					/>

					{/* Settings Dialog */}
					<AssessmentSettingsDialog
						open={settingsOpen}
						onOpenChange={setSettingsOpen}
						classId={
							settingsSubject?.class_id
								? settingsSubject?.class_id
								: ' '
						}
						subjectName={
							settingsSubject?.name ? settingsSubject?.name : ' '
						}
						gradeLevel={
							settingsSubject?.grade_level
								? settingsSubject?.grade_level
								: ' '
						}
					/>

					{/* Content */}
					{subjects.length === 0 ? (
						<SubjectEmptyState onCreateClick={handleCreateClick} />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Class</TableHead>
									<TableHead>Grade Level</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subjects.map((subject) => (
									<SubjectTableRow
										key={subject.subject_id}
										subject={subject}
										onEdit={handleEdit}
										onSettings={handleSettings}
										onDelete={handleDelete}
										isDeleting={deleteMutation.isPending}
									/>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
