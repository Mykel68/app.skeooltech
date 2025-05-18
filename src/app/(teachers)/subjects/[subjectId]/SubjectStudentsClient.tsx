"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useSearchParams } from "next/navigation";

interface Props {
  subjectId: string;
}

export default function SubjectStudentsClient({ subjectId }: Props) {
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName") || "Unknown Subject";

  const schoolId = useUserStore((s) => s.schoolId);
  const [students, setStudents] = useState<any[] | null>(null);
  const [subjectInfo, setSubjectInfo] = useState<any>(null);
  const [scores, setScores] = useState<
    Record<string, { exam: number; ca: number }>
  >({});

  useEffect(() => {
    if (schoolId && subjectId) {
      // Fetch students
      axios
        .get(`/api/student/${schoolId}/${subjectId}`)
        .then((res) => {
          setStudents(res.data?.data ?? []);
        })
        .catch(() => setStudents([]));

      // Fetch subject info (optional API endpoint)
      axios
        .get(`/api/subject/${subjectId}`)
        .then((res) => setSubjectInfo(res.data))
        .catch(() => setSubjectInfo(null));
    }
  }, [schoolId, subjectId]);

  const handleInputChange = (
    studentId: string,
    field: "exam" | "ca",
    value: string
  ) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: Number(value),
      },
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-1">{subjectName}</h2>
      <p className="text-gray-600 mb-4">
        Class: {students?.[0]?.class?.short || "N/A"}
      </p>

      {!students ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found for this subject.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">First Name</th>
                <th className="p-3 border-b">Last Name</th>
                <th className="p-3 border-b">Exam (60%)</th>
                <th className="p-3 border-b">CA</th>
                <th className="p-3 border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student: any) => {
                const studentScore = scores[student.user_id] || {
                  exam: 0,
                  ca: 0,
                };
                const total = studentScore.exam + studentScore.ca;

                return (
                  <tr key={student.user_id} className="border-t">
                    <td className="p-3">{student.first_name}</td>
                    <td className="p-3">{student.last_name}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="border p-1 rounded w-24"
                        value={studentScore.exam}
                        onChange={(e) =>
                          handleInputChange(
                            student.user_id,
                            "exam",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        className="border p-1 rounded w-24"
                        value={studentScore.ca}
                        onChange={(e) =>
                          handleInputChange(
                            student.user_id,
                            "ca",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3 font-semibold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
