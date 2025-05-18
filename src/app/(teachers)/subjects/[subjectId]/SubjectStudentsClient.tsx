"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

interface Props {
  subjectId: string;
}

export default function SubjectStudentsClient({ subjectId }: Props) {
  const schoolId = useUserStore((s) => s.schoolId);
  const [students, setStudents] = useState<any[] | null>(null); // start with null

  useEffect(() => {
    if (schoolId && subjectId) {
      axios
        .get(`/api/student/${schoolId}/${subjectId}`)
        .then((res) => {
          console.log("Fetched students:", res.data);
          setStudents(res.data?.students ?? []);
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
          setStudents([]); // fallback to empty array on error
        });
    }
  }, [schoolId, subjectId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Students Offering This Subject</h1>
      {!students ? (
        <p>Loading students...</p>
      ) : students.length > 0 ? (
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
