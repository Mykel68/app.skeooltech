import SubjectStudentsClient from "./SubjectStudentsClient";

export default async function SubjectStudentsPage({
  params,
}: {
  params: { subjectId: string };
}) {
  // Make this function async
  // await params before destructuring
  const { subjectId } = await params;

  return <SubjectStudentsClient subjectId={subjectId} />;
}
