const defaultAssignments: Assignment[] = [
	{
		id: '1',
		title: 'Calculus Problem Set 5',
		due_date: '2025-06-15',
		status: 'pending',
		subject_id: '1',
	},
	{
		id: '2',
		title: 'Statistics Project',
		due_date: '2025-06-20',
		status: 'pending',
		subject_id: '1',
	},
	{
		id: '3',
		title: 'Algebra Quiz',
		due_date: '2025-06-10',
		status: 'graded',
		grade: 85,
		max_grade: 100,
		subject_id: '1',
	},
	{
		id: '4',
		title: 'Shakespeare Essay',
		due_date: '2025-06-18',
		status: 'pending',
		subject_id: '2',
	},
	{
		id: '5',
		title: 'Poetry Analysis',
		due_date: '2025-06-12',
		status: 'submitted',
		subject_id: '2',
	},
	{
		id: '6',
		title: 'Lab Report - Pendulum',
		due_date: '2025-06-16',
		status: 'pending',
		subject_id: '3',
	},
	{
		id: '7',
		title: 'Thermodynamics Problems',
		due_date: '2025-06-22',
		status: 'pending',
		subject_id: '3',
	},
];

const defaultResources: Resource[] = [
	{
		id: '1',
		title: 'Calculus Reference Guide',
		type: 'pdf',
		uploaded_date: '2025-05-20',
		size: '2.5 MB',
		subject_id: '1',
	},
	{
		id: '2',
		title: 'Statistics Formulas',
		type: 'pdf',
		uploaded_date: '2025-05-18',
		size: '1.2 MB',
		subject_id: '1',
	},
	{
		id: '3',
		title: 'Practice Problems',
		type: 'doc',
		uploaded_date: '2025-05-15',
		size: '800 KB',
		subject_id: '1',
	},
	{
		id: '4',
		title: 'Shakespeare Study Guide',
		type: 'pdf',
		uploaded_date: '2025-05-22',
		size: '3.1 MB',
		subject_id: '2',
	},
	{
		id: '5',
		title: 'Grammar Rules',
		type: 'doc',
		uploaded_date: '2025-05-10',
		size: '1.5 MB',
		subject_id: '2',
	},
	{
		id: '6',
		title: 'Physics Lab Manual',
		type: 'pdf',
		uploaded_date: '2025-05-19',
		size: '4.2 MB',
		subject_id: '3',
	},
	{
		id: '7',
		title: 'Lecture Slides - Wave Motion',
		type: 'ppt',
		uploaded_date: '2025-05-17',
		size: '2.8 MB',
		subject_id: '3',
	},
];

const defaultGrades: Grade[] = [
	{
		id: '1',
		assessment_name: 'Mid-term Exam',
		grade: 88,
		max_grade: 100,
		date: '2025-05-10',
		type: 'test',
		subject_id: '1',
	},
	{
		id: '2',
		assessment_name: 'Assignment 1',
		grade: 92,
		max_grade: 100,
		date: '2025-05-05',
		type: 'assignment',
		subject_id: '1',
	},
	{
		id: '3',
		assessment_name: 'Quiz 1',
		grade: 85,
		max_grade: 100,
		date: '2025-04-28',
		type: 'quiz',
		subject_id: '1',
	},
	{
		id: '4',
		assessment_name: 'Essay Writing',
		grade: 78,
		max_grade: 100,
		date: '2025-05-12',
		type: 'assignment',
		subject_id: '2',
	},
	{
		id: '5',
		assessment_name: 'Literature Quiz',
		grade: 91,
		max_grade: 100,
		date: '2025-05-08',
		type: 'quiz',
		subject_id: '2',
	},
	{
		id: '6',
		assessment_name: 'Physics Lab Test',
		grade: 89,
		max_grade: 100,
		date: '2025-05-14',
		type: 'test',
		subject_id: '3',
	},
];

// Default/fallback data
const defaultClassDetails = {
	name: 'My Class',
	grade_level: 'Grade 12',
	class_id: 'default-class',
};

const defaultSubjects: Subject[] = [
	{
		subject_id: '1',
		name: 'Mathematics',
		short: 'MATH',
		teacher_name: 'Mr. Johnson',
		teacher_email: 'johnson@school.edu',
		description:
			'Advanced algebra, calculus, and statistical analysis for senior secondary students.',
		credits: 4,
		schedule: [
			{ day: 'Monday', time: '9:00 AM - 10:30 AM', room: 'Room 101' },
			{
				day: 'Wednesday',
				time: '9:00 AM - 10:30 AM',
				room: 'Room 101',
			},
			{ day: 'Friday', time: '2:00 PM - 3:30 PM', room: 'Room 101' },
		],
	},
	{
		subject_id: '2',
		name: 'English Language',
		short: 'ENG',
		teacher_name: 'Mrs. Smith',
		teacher_email: 'smith@school.edu',
		description:
			'Literature analysis, creative writing, and advanced grammar for effective communication.',
		credits: 3,
		schedule: [
			{
				day: 'Tuesday',
				time: '10:30 AM - 12:00 PM',
				room: 'Room 205',
			},
			{
				day: 'Thursday',
				time: '10:30 AM - 12:00 PM',
				room: 'Room 205',
			},
		],
	},
	{
		subject_id: '3',
		name: 'Physics',
		short: 'PHY',
		teacher_name: 'Dr. Brown',
		teacher_email: 'brown@school.edu',
		description:
			'Mechanics, thermodynamics, and modern physics with practical laboratory work.',
		credits: 4,
		schedule: [
			{
				day: 'Monday',
				time: '1:00 PM - 2:30 PM',
				room: 'Physics Lab',
			},
			{
				day: 'Thursday',
				time: '1:00 PM - 2:30 PM',
				room: 'Physics Lab',
			},
		],
	},
	{
		subject_id: '4',
		name: 'Chemistry',
		short: 'CHEM',
		teacher_name: 'Ms. Davis',
		teacher_email: 'davis@school.edu',
		description:
			'Organic and inorganic chemistry with emphasis on practical applications.',
		credits: 4,
		schedule: [
			{
				day: 'Tuesday',
				time: '2:00 PM - 3:30 PM',
				room: 'Chemistry Lab',
			},
			{
				day: 'Friday',
				time: '10:30 AM - 12:00 PM',
				room: 'Chemistry Lab',
			},
		],
	},
	{
		subject_id: '5',
		name: 'Biology',
		short: 'BIO',
		teacher_name: 'Mr. Wilson',
		teacher_email: 'wilson@school.edu',
		description: 'Cell biology, genetics, ecology, and human physiology.',
		credits: 3,
		schedule: [
			{
				day: 'Wednesday',
				time: '2:00 PM - 3:30 PM',
				room: 'Biology Lab',
			},
		],
	},
];
