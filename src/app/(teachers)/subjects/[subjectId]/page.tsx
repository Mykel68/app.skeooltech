import SubjectStudentsClient from "./SubjectStudentsClient";

interface Params {
  params: {
    subjectId: string;
  };
}

export default function SubjectStudentsPage({ params }: Params) {
  return <SubjectStudentsClient subjectId={params.subjectId} />;
}
