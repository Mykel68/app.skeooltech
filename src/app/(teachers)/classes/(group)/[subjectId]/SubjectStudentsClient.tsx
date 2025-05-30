"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [students, setStudents] = useState<any[] | null>(null);
  const [gradingComponents, setGradingComponents] = useState<
    { name: string; weight: number }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectName = searchParams.get("subjectName") || "Unknown Subject";
  const schoolId = useUserStore((s) => s.schoolId);

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
      setIsSaving(true);

      Object.entries(newScores).forEach(([comp, value]) => {
        setValue(`${selectedStudent.user_id}.${comp}`, value);
      });

      const classId = selectedStudent.class?.class_id;
      const user_id = selectedStudent.user_id;

      if (!classId || !user_id)
        throw new Error("Missing IDs for updating score");

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

  const fetchStudentsAndComponents = useCallback(async () => {
    try {
      const studentRes = await axios.get(
        `/api/student/${schoolId}/${subjectId}`
      );
      const studentList = studentRes.data?.data ?? [];

      setStudents(studentList);
      if (studentList.length === 0) return;

      try {
        const gradeRes = await axios.get(
          `/api/grade_setting/get-grade-setting/${schoolId}/${subjectId}`
        );
        const data = gradeRes.data?.data?.data;
        const components = data?.components || [];
        setGradingComponents(components);
      } catch {
        setGradingComponents([]);
        toast.warning("No grading components set. Redirecting to settings...");

        const firstStudent = studentList[0];
        const classId = firstStudent?.class?.class_id;
        const gradeLevel = firstStudent?.class?.grade_level;

        router.push(
          `/classes/settings?class=${classId}&subjectName=${encodeURIComponent(
            subjectName
          )}&gradeLevel=${encodeURIComponent(gradeLevel || "")}`
        );
      }
    } catch {
      setStudents([]);
    }
  }, [schoolId, subjectId, router, subjectName]);

  const fetchScoreList = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/student/scores/score-list/${schoolId}/${subjectId}`
      );
      const result = res.data?.data?.data?.[0];

      if (!result) {
        fetchStudentsAndComponents();
        return;
      }

      const scoreData = result.students ?? [];
      const grading = result.grading ?? [];

      if (scoreData.length > 0) {
        const extractedStudents = scoreData.map((entry: any) => ({
          ...entry.student,
          class: {
            short: result.class?.name || "N/A",
            class_id: result.class?.class_id,
            grade_level: result.class?.grade_level,
          },
        }));

        setHasPreviousScores(true);
        setStudents(extractedStudents);

        const components = grading.map((g: any) => ({
          name: g.name,
          weight: g.weight,
        }));
        setGradingComponents(components);

        setTimeout(() => {
          scoreData.forEach((entry: any) => {
            entry.student.scores.forEach((score: any) => {
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
    } catch {
      fetchStudentsAndComponents();
    }
  }, [schoolId, subjectId, fetchStudentsAndComponents, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const classId = students?.[0]?.class?.class_id;
      if (!classId) throw new Error("Missing class ID");

      const payload = {
        scores: students.map((student) => {
          const user_id = student.user_id;
          const componentScores = data[user_id] || {};

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
    } catch {
      toast.error("Failed to save scores.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (schoolId && subjectId) {
      fetchScoreList();
    }
  }, [schoolId, subjectId, fetchScoreList]);

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
