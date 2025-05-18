"use client"; // ⬅️ Important to make it a client component

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

interface Params {
  params: {
    subjectId: string;
  };
}

export default function SubjectStudentsPage({ params }: Params) {
  const { subjectId } = params;
  const schoolId = useUserStore((s) => s.schoolId);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (schoolId) {
      axios
        .get(`/api/student/${schoolId}/${subjectId}`)
        .then((res) => setStudents(res.data.students));
    }
  }, [schoolId, subjectId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Students Offering This Subject</h1>
      {students.length > 0 ? (
        <ul className="space-y-2">
          {students.map((student: any) => (
            <li key={student.id} className="border p-2 rounded">
              {student.name} ({student.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found for this subject.</p>
      )}
    </div>
  );
}
