import SubjectStudentsClient from "./SubjectStudentsClient";

export default async function SubjectStudentsPage({
  params,
}: {
  params: { subjectId: string };
}) {
  // Make this function async
  // await params before destructuring
  const { subjectId } = await params;

  return (
    <div className=" space-y-4 p-4">
      <SubjectStudentsClient subjectId={subjectId} />
    </div>
  );
}
