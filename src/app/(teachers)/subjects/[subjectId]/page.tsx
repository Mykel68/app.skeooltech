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
      <h1 className="text-2xl font-bold">Grade </h1>
      <SubjectStudentsClient subjectId={subjectId} />
    </div>
  );
}
