"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

interface Props {
  subjectId: string;
}

type FormValues = Record<string, Record<string, number | string>>;

export default function SubjectStudentsClient({ subjectId }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectName = searchParams.get("subjectName") || "Unknown Subject";

  const schoolId = useUserStore((s) => s.schoolId);
  const [students, setStudents] = useState<any[] | null>(null);
  const [gradingComponents, setGradingComponents] = useState<
    { name: string; weight: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange" });

  const watchedValues = useWatch({ control });

  // 1. Fetch scores first
  useEffect(() => {
    if (schoolId && subjectId) {
      axios
        .get(`/api/student/scores/score-list/${schoolId}/${subjectId}`)
        .then((res) => {
          const scoreData = res.data?.data?.data;
          if (scoreData?.length > 0) {
            // Set students from score list
            const extractedStudents = scoreData.map((entry: any) => ({
              ...entry.student,
              class: { short: "N/A" }, // You can adjust this as needed
            }));
            setStudents(extractedStudents);

            // Extract grading component names
            const first = scoreData[0];
            const components = first.scores.map((s: any) => ({
              name: s.component_name,
              weight: 100, // default; adjust if you have weights
            }));
            setGradingComponents(components);

            // Set form default values
            scoreData.forEach((entry: any) => {
              entry.scores.forEach((score: any) => {
                setValue(
                  `${entry.student.user_id}.${score.component_name}`,
                  score.score
                );
              });
            });
          } else {
            fetchStudentsAndComponents();
          }
        })
        .catch(() => {
          fetchStudentsAndComponents();
        });
    }
  }, [schoolId, subjectId]);

  // 2. If no scores, fallback to normal student and grading component fetch
  const fetchStudentsAndComponents = () => {
    axios
      .get(`/api/student/${schoolId}/${subjectId}`)
      .then((res) => {
        const studentList = res.data?.data ?? [];
        setStudents(studentList);

        if (studentList.length === 0) return;

        return axios
          .get(`/api/grade_setting/get-grade-setting/${schoolId}/${subjectId}`)
          .then((res) => {
            const data = res.data?.data?.data;
            const components = data?.components || [];
            setGradingComponents(components);
          })
          .catch(() => {
            setGradingComponents([]);
            toast.warning(
              "No grading components set. Redirecting to settings..."
            );

            const firstStudent = studentList[0];
            const classId = firstStudent?.class?.class_id;
            const gradeLevel = firstStudent?.class?.grade_level;

            router.push(
              `/subjects/settings?class=${classId}&subjectName=${encodeURIComponent(
                subjectName
              )}&gradeLevel=${encodeURIComponent(gradeLevel || "")}`
            );
          });
      })
      .catch(() => {
        setStudents([]);
      });
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);

    try {
      const payload = Object.entries(data).map(
        ([user_id, componentScores]) => ({
          user_id,
          scores: Object.entries(componentScores).map(
            ([component_name, score]) => ({
              component_name,
              score: Number(score),
            })
          ),
        })
      );

      const classId = students?.[0]?.class?.class_id;

      if (!classId) throw new Error("Missing class ID");

      await axios.post(`/api/student/scores/assign/${schoolId}/${classId}`, {
        scores: payload,
      });

      toast.success("Scores saved successfully.");
    } catch (err) {
      toast.error("Failed to save scores.");
    } finally {
      setIsSaving(false);
    }
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
        <form onSubmit={handleSubmit(onSubmit)}>
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
                                errors[student.user_id!][comp.name]
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

          <div className="mt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Scores"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
