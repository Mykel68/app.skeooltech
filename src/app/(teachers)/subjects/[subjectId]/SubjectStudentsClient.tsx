"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

interface Props {
  subjectId: string;
}

type FormValues = Record<string, Record<string, number | string>>;

export default function SubjectStudentsClient({ subjectId }: Props) {
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName") || "Unknown Subject";

  const schoolId = useUserStore((s) => s.schoolId);
  const [students, setStudents] = useState<any[] | null>(null);
  const [gradingComponents, setGradingComponents] = useState<
    { name: string; weight: number }[]
  >([]);

  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  // Watch all inputs for all students & components
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (schoolId && subjectId) {
      axios
        .get(`/api/student/${schoolId}/${subjectId}`)
        .then((res) => {
          setStudents(res.data?.data ?? []);
        })
        .catch(() => setStudents([]));

      axios
        .get(`/api/grade_setting/get-grade-setting/${schoolId}/${subjectId}`)
        .then((res) => {
          const data = res.data.data.data;
          setGradingComponents(data?.components || []);
        })
        .catch(() => {
          setGradingComponents([]);
        });
    }
  }, [schoolId, subjectId]);

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
        <form>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">First Name</th>
                  <th className="p-3 border-b">Last Name</th>
                  {gradingComponents.map((comp) => (
                    <th key={comp.name} className="p-3 border-b capitalize">
                      {comp.name} ({comp.weight}%)
                    </th>
                  ))}
                  <th className="p-3 border-b">Total</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  // Calculate total weighted score for this student
                  const total = gradingComponents.reduce((sum, comp) => {
                    const val =
                      watchedValues?.[student.user_id]?.[comp.name] ?? 0;
                    const num = Number(val) || 0;
                    return sum + (num > comp.weight ? comp.weight : num);
                  }, 0);

                  return (
                    <tr key={student.user_id} className="border-t">
                      <td className="p-3">{student.first_name}</td>
                      <td className="p-3">{student.last_name}</td>
                      {gradingComponents.map((comp) => (
                        <td key={comp.name} className="p-3">
                          <input
                            type="number"
                            min={0}
                            max={comp.weight}
                            className={`border p-1 rounded w-24 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                              errors?.[student.user_id]?.[comp.name]
                                ? "border-red-500"
                                : ""
                            }`}
                            {...register(`${student.user_id}.${comp.name}`, {
                              valueAsNumber: true,
                              min: {
                                value: 0,
                                message: `${comp.name} cannot be less than 0`,
                              },
                              max: {
                                value: comp.weight,
                                message: `${comp.name} cannot exceed ${comp.weight}`,
                              },
                            })}
                          />
                          {errors?.[student.user_id]?.[comp.name] && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                errors[student.user_id][comp.name]
                                  ?.message as string
                              }
                            </p>
                          )}
                        </td>
                      ))}
                      <td className="p-3 font-semibold">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </form>
      )}
    </div>
  );
}
