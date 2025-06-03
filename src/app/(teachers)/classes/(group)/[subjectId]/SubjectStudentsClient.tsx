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

type FormValues = {
  // Top-level keys are student IDs,
  // each mapping to an object whose keys are component names (normalized).
  [userId: string]: {
    [componentKey: string]: number;
  };
};

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

  // 1) Create a single form for everything:
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange", defaultValues: {} });

  const watchedValues = useWatch({ control });

  const openStudentSheet = (student: any) => {
    // We want to pass the currently watched values (if any)
    // or fallback to 0. But: watchedValues keys must align with
    // how we `reset(...)` them below.
    const currentScores = gradingComponents.map((comp) => {
      const key = comp.name.replace(/\s+/g, "_");
      const existing = watchedValues?.[student.user_id]?.[key] ?? 0;
      return {
        component_name: comp.name,
        score: existing,
      };
    });

    setSelectedStudent({ ...student, scores: currentScores });
    setIsSheetOpen(true);
  };

  const updateStudentScores = async (newScores: Record<string, number>) => {
    if (!selectedStudent) return;

    try {
      setIsSaving(true);

      // Write incoming newScores directly into the same form state
      Object.entries(newScores).forEach(([compKey, value]) => {
        setValue(`${selectedStudent.user_id}.${compKey}`, value);
      });

      const classId = selectedStudent.class?.class_id;
      const user_id = selectedStudent.user_id;
      if (!classId || !user_id)
        throw new Error("Missing IDs for updating score");

      const payload = {
        user_id,
        scores: Object.entries(newScores).map(([component_name, score]) => ({
          component_name,
          score,
        })),
      };

      await axios.patch(
        `/api/student/scores/edit-student-scores/${schoolId}/${classId}`,
        payload
      );
      toast.success("Scores updated.");
      setIsSheetOpen(false);
    } catch {
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

      // If no existing scores for this subject, just fetch fresh students & components:
      if (!result || result.students?.length === 0) {
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

        // After both students & gradingComponents are in state, we need to reset() the form:
        // Build defaultValues: { [userId]: { [normalizedCompName]: score } }
        setTimeout(() => {
          const defaults: FormValues = {};

          scoreData.forEach((entry: any) => {
            const userId = entry.student.user_id;
            defaults[userId] = {};

            entry.student.scores.forEach((scoreObj: any) => {
              // Normalize key exactly as we’ll use it in <StudentScoreRow>
              const key = scoreObj.component_name.replace(/\s+/g, "_");
              defaults[userId][key] = scoreObj.score;
            });
          });

          // It's possible some components are missing scores → fill them
          extractedStudents.forEach((stu: any) => {
            if (!defaults[stu.user_id]) {
              defaults[stu.user_id] = {};
            }
            grading.forEach((g: any) => {
              const normalized = g.name.replace(/\s+/g, "_");
              if (defaults[stu.user_id][normalized] == null) {
                defaults[stu.user_id][normalized] = 0;
              }
            });
          });

          reset(defaults);
        }, 100);
      } else {
        fetchStudentsAndComponents();
      }
    } catch {
      fetchStudentsAndComponents();
    }
  }, [schoolId, subjectId, fetchStudentsAndComponents, reset]);

  // Whenever we get fresh students + components, recalc default values for a “blank slate” (no previous scores):
  useEffect(() => {
    if (
      students !== null &&
      gradingComponents.length > 0 &&
      !hasPreviousScores
    ) {
      const defaults: FormValues = {};
      students.forEach((stu) => {
        defaults[stu.user_id] = {};
        gradingComponents.forEach((comp) => {
          const key = comp.name.replace(/\s+/g, "_");
          // If the Student object has a `scores` array, use that; else default to 0
          const existingScoreObj = stu.scores?.find(
            (s: any) => s.component_name.replace(/\s+/g, "_") === key
          );
          defaults[stu.user_id][key] = existingScoreObj
            ? existingScoreObj.score
            : 0;
        });
      });
      reset(defaults);
    }
  }, [students, gradingComponents, hasPreviousScores, reset]);

  const onSubmit = async (data: FormValues) => {
    console.log("Form submit data:", data);
    setIsSaving(true);

    try {
      const classId = students?.[0]?.class?.class_id;
      if (!classId) throw new Error("Missing class ID");

      // Transform into the API shape:
      const formattedScores = Object.entries(data).map(([userId, comps]) => ({
        user_id: userId,
        scores: Object.entries(comps).map(([component_name, score]) => ({
          component_name, // this key must match backend’s expected component_name
          score: Number(score),
        })),
      }));

      const payload = { scores: formattedScores };

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

  // Kick everything off:
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
            // 2) Only one <form>—the parent’s:
            <form onSubmit={handleSubmit(onSubmit)}>
              <GradingTable
                students={students}
                gradingComponents={gradingComponents}
                onStudentClick={openStudentSheet}
                register={register}
                control={control}
                errors={errors}
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
