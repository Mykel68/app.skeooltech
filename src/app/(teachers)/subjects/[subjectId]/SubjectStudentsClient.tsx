"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradingTable } from "./GradingTable";

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

  // Fetch scores or fallback
  useEffect(() => {
    if (schoolId && subjectId) {
      axios
        .get(`/api/student/scores/score-list/${schoolId}/${subjectId}`)
        .then((res) => {
          const scoreData = res.data?.data?.data;
          if (scoreData?.length > 0) {
            const extractedStudents = scoreData.map((entry: any) => ({
              ...entry.student,
              class: {
                short: entry.class?.[0]?.name || "N/A",
                class_id: entry.class?.[0]?.class_id,
                grade_level: entry.class?.[0]?.grade_level,
              },
            }));
            setStudents(extractedStudents);

            const first = scoreData[0];
            const components = first.scores.map((s: any) => ({
              name: s.component_name,
              weight: s.weight, // Or fetch the real weight if stored
            }));
            console.log(components);
            setGradingComponents(components);

            // Set values after slight delay to ensure inputs are mounted
            setTimeout(() => {
              scoreData.forEach((entry: any) => {
                entry.scores.forEach((score: any) => {
                  setValue(
                    `${entry.student.user_id}.${score.component_name}`,
                    score.score
                  );
                });
              });
            }, 100);
          } else {
            fetchStudentsAndComponents();
          }
        })
        .catch(() => {
          fetchStudentsAndComponents();
        });
    }
  }, [schoolId, subjectId]);

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
    <Card className="p-6">
      <CardHeader>
        <h2 className="text-xl font-bold">{subjectName}</h2>
        <p className="text-muted-foreground">
          Class: {students?.[0]?.class?.short || "N/A"}
        </p>
      </CardHeader>
      <CardContent>
        {!students ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students found for this subject.</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <GradingTable
              students={students}
              gradingComponents={gradingComponents}
              register={register}
              errors={errors}
              control={control}
            />

            <div className="mt-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Scores"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
