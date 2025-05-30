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
import { StudentScoreSheet } from "./StudentScoreSheet";

interface Props {
  subjectId: string;
}

type FormValues = Record<string, Record<string, number | string>>;

export default function SubjectStudentsClient({ subjectId }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [hasPreviousScores, setHasPreviousScores] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const openStudentSheet = (student: any) => {
    const currentScores = gradingComponents.map((comp) => ({
      component_name: comp.name,
      score:
        watchedValues?.[student.user_id]?.[comp.name] ??
        student[comp.name] ??
        0,
    }));

    setSelectedStudent({ ...student, scores: currentScores });
    setIsSheetOpen(true);
  };

  const updateStudentScores = async (newScores: Record<string, number>) => {
    if (!selectedStudent) return;

    try {
      console.log("→ newScores:", newScores);
      setIsSaving(true);

      // Update form values locally
      Object.entries(newScores).forEach(([comp, value]) => {
        setValue(`${selectedStudent.user_id}.${comp}`, value);
      });

      const classId = selectedStudent.class?.class_id;
      const user_id = selectedStudent.user_id;
      // const score_id = selectedStudent.score_id; // make sure this exists

      // console.log("selectedStudent:", selectedStudent);
      // console.log("→ classId:", classId);
      // console.log("→ user_id:", user_id);
      // console.log("→ score_id:", score_id);
      if (!classId || !user_id) {
        throw new Error("Missing IDs for updating score");
      }

      const payload = {
        user_id,
        scores: [
          {
            user_id,
            scores: Object.entries(newScores).map(
              ([component_name, score]) => ({
                component_name,
                score,
              })
            ),
          },
        ],
      };

      await axios.patch(
        `/api/student/scores/edit-student-scores/${schoolId}/${classId}`,
        payload
      );

      toast.success("Scores updated.");
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Failed to update scores.");
    } finally {
      setIsSaving(false);
    }
  };

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
                short: entry.class?.name || "N/A",
                class_id: entry.class?.[0]?.class_id,
                grade_level: entry.class?.[0]?.grade_level,
              },
            }));
            setHasPreviousScores(true);
            setStudents(extractedStudents);

            const first = scoreData[0];
            const components = first.scores.map((s: any) => {
              const matchedGrading = first.grading.find(
                (g: any) => g.name === s.component_name
              );
              return {
                name: s.component_name,
                weight: matchedGrading ? matchedGrading.weight : 0,
              };
            });
            // console.log("components", components);
            setGradingComponents(components);
            // console.log("setGradingComponents", gradingComponents);

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
              `/classes/settings?class=${classId}&subjectName=${encodeURIComponent(
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
      console.log("student scores:", data);
      const classId = students?.[0]?.class?.class_id;
      if (!classId) throw new Error("Missing class ID");

      const payload = {
        scores: students.map((student) => {
          const user_id = student.user_id;
          const componentScores = data.students?.[user_id] || {};

          return {
            user_id,
            scores: Object.entries(componentScores).map(
              ([component_name, score]) => ({
                component_name,
                score: Number(score) || 0,
              })
            ),
          };
        }),
      };

      console.log("→ payload:", payload);

      if (hasPreviousScores) {
        await axios.patch(
          `/api/student/scores/editBulk-student-scores/${schoolId}/${classId}`,
          payload
        );
        toast.success("Scores updated successfully.");
      } else {
        await axios.post(
          `/api/student/scores/assign/${schoolId}/${classId}`,
          payload
        );
        toast.success("Scores saved successfully.");
      }
    } catch (err) {
      toast.error("Failed to save scores.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="p-6">
        <CardHeader>
          <h2 className="text-xl font-bold">Grade scores for {subjectName}</h2>
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
                onStudentClick={openStudentSheet}
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

      {selectedStudent && (
        <StudentScoreSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          student={selectedStudent}
          components={gradingComponents}
          updateScores={updateStudentScores}
        />
      )}
    </>
  );
}
