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
  classId: string;
}

type FormValues = {
  [userId: string]: {
    [componentKey: string]: number;
  };
};

type ScorePayload = {
  user_id: string;
  scores: { component_name: string; score: number }[];
};

// (Utility for normalization, identical to StudentScoreRow’s normalizeKey)
const normalizeKey = (key: string) => key.replace(/\s+/g, "_");

export default function SubjectStudentsClient({ classId }: Props) {
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
  const subjectId = searchParams.get("subjectId") || "";
  const subjectName = searchParams.get("subjectName") || "Unknown Subject";
  const schoolId = useUserStore((s) => s.schoolId);

  // 1) Single form instance for all student scores:
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onChange", defaultValues: {} });

  // We’ll use this to pull out “currently‐typed” values when opening the sheet:
  const watchedValues = useWatch({ control });

  const openStudentSheet = (student: any) => {
    // For each grading component, see if there’s already a watched value;
    // otherwise default to 0. Keys must match exactly how we built defaultValues below.
    const currentScores = gradingComponents.map((comp) => {
      const key = normalizeKey(comp.name);
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
      Object.entries(newScores).forEach(([compName, value]) => {
        const normalized = normalizeKey(compName);
        setValue(`${selectedStudent.user_id}.${normalized}`, value);
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
      const studentRes = await axios.get(`/api/student/${schoolId}/${classId}`);
      const studentList = studentRes.data?.data ?? [];
      setStudents(studentList);

      if (studentList.length === 0) return;

      try {
        const gradeRes = await axios.get(
          `/api/grade_setting/get-grade-setting/${schoolId}/${classId}`
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
  }, [schoolId, classId, router, subjectName]);

  const fetchScoreList = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/student/scores/score-list/${schoolId}/${classId}`
      );
      const result = res.data?.data?.data?.[0];

      // If nothing saved yet, fallback to just students + components:
      if (!result || result.students?.length === 0) {
        fetchStudentsAndComponents();
        return;
      }

      const scoreData = result.students ?? [];
      const grading = result.grading ?? [];

      if (scoreData.length > 0) {
        // Build student objects
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

        // Build an array of { name, weight } for each component
        const components = grading.map((g: any) => ({
          name: g.name,
          weight: g.weight,
        }));
        setGradingComponents(components);

        // Now that we have both students & gradingComponents, we can build defaultValues
        setTimeout(() => {
          const defaults: FormValues = {};

          scoreData.forEach((entry: any) => {
            const userId = entry.student.user_id;
            defaults[userId] = {};

            entry.student.scores.forEach((scoreObj: any) => {
              // Normalize to lowercase_with_underscores
              const key = normalizeKey(scoreObj.component_name);
              defaults[userId][key] = scoreObj.score;
            });
          });

          // If any component is missing a saved score → fill with 0
          extractedStudents.forEach((stu: any) => {
            if (!defaults[stu.user_id]) {
              defaults[stu.user_id] = {};
            }
            grading.forEach((g: any) => {
              const normalized = normalizeKey(g.name);
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
  }, [schoolId, classId, fetchStudentsAndComponents, reset]);

  // When we have students + components and there were no previous scores:
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
          const key = normalizeKey(comp.name);
          const existingScoreObj = stu.scores?.find(
            (s: any) => normalizeKey(s.component_name) === key
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

      const editPayload: ScorePayload[] = [];
      const newPayload: ScorePayload[] = [];

      // For each student… figure out which scores already exist vs. new
      for (const [userId, comps] of Object.entries(data)) {
        const student = students.find((s) => s.user_id === userId);
        if (!student) continue;

        const existing: { component_name: string; score: number }[] = [];
        const fresh: { component_name: string; score: number }[] = [];

        for (const [component_name, score] of Object.entries(comps)) {
          const alreadyExists = student.previousScores?.some(
            (s: any) => normalizeKey(s.component_name) === component_name
          );

          const scoreEntry = {
            component_name,
            score: Number(score),
          };

          if (alreadyExists) {
            existing.push(scoreEntry);
          } else {
            fresh.push(scoreEntry);
          }
        }

        if (existing.length) {
          editPayload.push({
            user_id: userId,
            scores: existing,
          });
        }
        if (fresh.length) {
          newPayload.push({
            user_id: userId,
            scores: fresh,
          });
        }
      }

      // PATCH existing:
      if (editPayload.length > 0) {
        await axios.patch(
          `/api/student/scores/editBulk-student-scores/${schoolId}/${classId}/${subjectId}`,
          { scores: editPayload }
        );
        toast.success("Scores updated successfully.");
      }

      // POST new:
      if (newPayload.length > 0) {
        await axios.post(
          `/api/student/scores/assign/${schoolId}/${classId}/${subjectId}`,
          {
            scores: newPayload,
          }
        );
        toast.success("New scores saved successfully.");
      }

      if (!editPayload.length && !newPayload.length) {
        toast.info("No changes to submit.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save scores.");
    } finally {
      setIsSaving(false);
    }
  };

  // Kick everything off once we have schoolId + classId
  useEffect(() => {
    if (schoolId && classId) {
      fetchScoreList();
    }
  }, [schoolId, classId, fetchScoreList]);

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
