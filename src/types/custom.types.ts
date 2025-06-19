type Assignment = {
	id: string;
	title: string;
	due_date: string;
	status: 'pending' | 'submitted' | 'graded';
	grade?: number;
	max_grade?: number;
	subject_id: string;
};

type Resource = {
	id: string;
	title: string;
	type: 'pdf' | 'doc' | 'ppt';
	uploaded_date: string;
	size: string;
	subject_id: string;
};

type Grade = {
	id: string;
	assessment_name: string;
	grade: number;
	max_grade: number;
	date: string;
	type: 'test' | 'assignment' | 'quiz';
	subject_id: string;
};

type Subject = {
	subject_id: string;
	name: string;
	short: string;
	teacher_name: string;
	teacher_email: string;
	description: string;
	credits: number;
	schedule: {
		day: string;
		time: string;
		room: string;
	}[];
};
