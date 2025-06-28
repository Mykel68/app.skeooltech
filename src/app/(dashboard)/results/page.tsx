"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Award,
  BookOpen,
  BarChart3,
  Download,
  Loader2,
  AlertCircle,
  School,
  FileText,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { cn } from "@/lib/utils";
import ReportCard from "./ReportCard";
import {
  getGrade,
  getGradeColor,
  getGradeBadgeVariant,
  getRemarkFromGrade,
} from "@/lib/grades";

interface ScoreComponent {
  score: number;
  component_name: string;
  component_total: number; // <-- note this field
}

interface Subject {
  subject_id: string;
  name: string;
  short: string;
}

interface SubjectWithScore {
  subject: Subject;
  score_id: string;
  scores: ScoreComponent[];
  total_score: number;
  grading_total: number; // <-- note this field
  class_average?: number;
}

interface ClassInfo {
  class_id: string;
  name: string;
  grade_level: string;
}

interface ResultsData {
  class: ClassInfo;
  subjectsWithScores: SubjectWithScore[];
}

interface ApiResponse {
  success: boolean;
  data: {
    message: string;
    data: ResultsData;
  };
}

// Student Report Interface for individual downloads
export interface StudentReportData {
  school: {
    name: string;
    address: string;
    logo?: string;
  };
  student: {
    name: string;
    admissionNumber: string;
    class: string;
    age?: number;
    attendance: {
      schoolOpened: number;
      timesPresent: number;
      timesAbsent: number;
    };
  };
  session: string;
  term: string;
  subjects: Array<{
    name: string;
    scores: {
      firstTest: { score: number; total: number };
      secondTest: { score: number; total: number };
      project: { score: number; total: number };
      exam: { score: number; total: number };
    };
    total: number;
    grade: string;
    position: number;
    remark: string;
  }>;
  summary: {
    totalScore: number;
    totalPossible: number;
    average: number;
    position: number;
    totalInClass: number;
    grade: string;
  };
  classTeacher: {
    name: string;
    signature?: string;
  };
  principal: {
    name: string;
    signature?: string;
  };
  nextTermBegins: string;
  comments: {
    classTeacher: string;
    principal: string;
  };
}

// Report Card Component

export default function ResultsPage() {
  const { schoolId, session_id, term_id } = useUserStore();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<StudentReportData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch available classes for the school
  const { data: classes } = useQuery({
    queryKey: ["school-classes", schoolId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/school/get-class-no-auth/${schoolId}`
      );
      return response.data.data.classes as ClassInfo[];
    },
    enabled: !!schoolId,
  });

  // Fetch results for selected class
  const {
    data: results,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["class-results", schoolId, session_id, term_id, selectedClassId],
    queryFn: async () => {
      const response = await axios.get(
        `/api/result/${schoolId}/${session_id}/${term_id}/${selectedClassId}`
      );
      return response.data as ApiResponse;
    },
    enabled: !!schoolId && !!selectedClassId && !!term_id && !!session_id,
  });

  // Set default class when classes load
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].class_id);
    }
  }, [classes, selectedClassId]);

  const calculateOverallStats = (subjects: SubjectWithScore[]) => {
    if (!subjects.length)
      return { average: 0, totalSubjects: 0, passedSubjects: 0 };

    const totalScoreSum = subjects.reduce(
      (sum, subject) => sum + subject.total_score,
      0
    );
    const average = totalScoreSum / subjects.length;
    const passedSubjects = subjects.filter(
      (subject) => subject.total_score >= subject.grading_total * 0.5
    ).length;

    return {
      average: Math.round(average * 10) / 10,
      totalSubjects: subjects.length,
      passedSubjects,
    };
  };

  if (!schoolId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            School information not found. Please log in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Class Results</h1>
            <p className="text-muted-foreground">
              View academic performance across all subjects
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Class Selector */}
            <div className="min-w-[200px]">
              <Select
                value={selectedClassId}
                onValueChange={setSelectedClassId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((classItem) => (
                    <SelectItem
                      key={classItem.class_id}
                      value={classItem.class_id}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{classItem.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {classItem.grade_level}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading results...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive">
                Failed to load results. Please try again.
              </p>
            </div>
          </div>
        )}

        {results?.data?.data && (
          <>
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {(() => {
                const stats = calculateOverallStats(
                  results.data.data.subjectsWithScores
                );
                return (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Class Average
                          </span>
                        </div>
                        <div className="mt-2">
                          <span
                            className={cn(
                              "text-2xl font-bold",
                              getGradeColor(stats.average)
                            )}
                          >
                            {stats.average}%
                          </span>
                          <Badge
                            variant={getGradeBadgeVariant(stats.average)}
                            className="ml-2"
                          >
                            {getGrade(stats.average)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Total Subjects
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-bold">
                            {stats.totalSubjects}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Subjects with Pass Rate
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-green-600">
                            {stats.passedSubjects}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{stats.totalSubjects}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-purple-600" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Class
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-lg font-bold">
                            {results.data.data.class.grade_level}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {results.data.data.class.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </motion.div>

            {/* Subject Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Subject Performance</h2>

              <div className="grid gap-4">
                {results.data.data.subjectsWithScores.map(
                  (subjectData, index) => (
                    <motion.div
                      key={subjectData.subject.subject_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                  {subjectData.subject.short}
                                </span>
                              </div>
                              <div>
                                <CardTitle className="text-lg">
                                  {subjectData.subject.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {subjectData.scores.length} components
                                  assessed
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-2xl font-bold",
                                    getGradeColor(
                                      (subjectData.total_score /
                                        subjectData.grading_total) *
                                        100
                                    )
                                  )}
                                >
                                  {subjectData.total_score} /{" "}
                                  {subjectData.grading_total}
                                </span>
                                <Badge
                                  variant={getGradeBadgeVariant(
                                    (subjectData.total_score /
                                      subjectData.grading_total) *
                                      100
                                  )}
                                >
                                  {getGrade(
                                    (subjectData.total_score /
                                      subjectData.grading_total) *
                                      100
                                  )}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {subjectData.total_score >=
                                subjectData.grading_total * 0.5 ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {subjectData.total_score >=
                                  subjectData.grading_total * 0.5
                                    ? "Pass"
                                    : "Fail"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {/* Subject-level progress */}
                            <Progress
                              value={Math.round(
                                (subjectData.total_score /
                                  subjectData.grading_total) *
                                  100
                              )}
                              className="h-2"
                            />

                            <Separator />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              {subjectData.scores.map((component, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                      {component.component_name}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-sm font-bold",
                                        getGradeColor(
                                          (component.score /
                                            component.component_total) *
                                            100
                                        )
                                      )}
                                    >
                                      {component.score} /{" "}
                                      {component.component_total}
                                    </span>
                                  </div>
                                  {/* Component-level progress */}
                                  <Progress
                                    value={Math.round(
                                      (component.score /
                                        component.component_total) *
                                        100
                                    )}
                                    className="h-1"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}

        {results?.data?.data?.subjectsWithScores?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
            <p className="text-muted-foreground">
              No assessment results found for the selected class.
            </p>
          </motion.div>
        )}
      </div>
      {showReport && reportData && (
        <ReportCard
          //   ref={reportRef}
          data={reportData}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
