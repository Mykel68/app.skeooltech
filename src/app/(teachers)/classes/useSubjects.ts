import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Subject, SubjectFormValues, SchoolClass } from './SubjectForm';

export const useSubjects = ({
	schoolId,
	userId,
	sessionId,
	termId,
	onFormClose,
}: {
	schoolId: string;
	userId: string;
	sessionId: string;
	termId: string;
	onFormClose: () => void;
}) => {
	const queryClient = useQueryClient();

	// Queries
	const classesQuery = useQuery<SchoolClass[]>({
		queryKey: ['classes', schoolId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/class/get-all-class/${schoolId}`
			);
			return data.data.classes;
		},
		enabled: !!schoolId,
	});

	const subjectsQuery = useQuery<Subject[]>({
		queryKey: ['subjects', schoolId, userId, sessionId, termId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/subject/by-teacher/${sessionId}/${termId}/${userId}`
			);
			return data.data.subjects;
		},
		enabled: !!schoolId && !!userId && !!sessionId && !!termId,
	});

	// Mutations
	const createSubjectMutation = useMutation({
		mutationFn: async (
			payload: SubjectFormValues & {
				schoolId: string;
				sessionId: string;
				termId: string;
			}
		) => {
			const { name, short, class_id, sessionId, termId } = payload;
			await axios.post(
				`/api/subject/create-new/${sessionId}/${termId}/${class_id}`,
				{
					name,
					short,
				}
			);
		},
		onSuccess: () => {
			toast.success('Subject created!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
			onFormClose();
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || 'Failed to create subject'
			);
		},
	});

	const updateSubjectMutation = useMutation({
		mutationFn: async (
			payload: SubjectFormValues & {
				subject_id: string;
				schoolId: string;
			}
		) => {
			const { name, short, class_id, subject_id, schoolId } = payload;
			await axios.patch(`/api/subject/update/${schoolId}/${subject_id}`, {
				name,
				short,
				class_id,
			});
		},
		onSuccess: () => {
			toast.success('Subject updated!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
			onFormClose();
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || 'Failed to update subject'
			);
		},
	});

	const deleteSubjectMutation = useMutation({
		mutationFn: async ({
			subject_id,
			schoolId,
		}: {
			subject_id: string;
			schoolId: string;
		}) => {
			await axios.delete(`/api/subject/delete/${schoolId}/${subject_id}`);
		},
		onSuccess: () => {
			toast.success('Subject deleted!');
			queryClient.invalidateQueries({
				queryKey: ['subjects', schoolId, userId],
			});
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || 'Failed to delete subject'
			);
		},
	});

	return {
		classesQuery,
		subjectsQuery,
		createSubjectMutation,
		updateSubjectMutation,
		deleteSubjectMutation,
	};
};
