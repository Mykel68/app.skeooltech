import SubjectStudentsClient from './SubjectStudentsClient';

export default async function SubjectStudentsPage({
	params,
}: {
	params: Promise<{ classId: string }>;
}) {
	// Make this function async
	// await params before destructuring
	const { classId } = await params;

	return (
		<div className=' space-y-4 p-4'>
			<SubjectStudentsClient classId={classId} />
		</div>
	);
}
