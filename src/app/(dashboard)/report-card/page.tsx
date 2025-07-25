"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer, TrendingUp, Award } from "lucide-react";
import ReportCard from "../results/ReportCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/store/userStore";

/* ---------------------------------------------------
 * ✅ TYPES
 * --------------------------------------------------- */

interface SubjectScore {
  subject_id: string;
  subject_name: string;
  total_score: number;
  teacher_name?: string;
  short?: string;
}

interface Term {
  name: string;
  start_date: string;
  end_date: string;
  scores: SubjectScore[];
  overall_position: number;
  totalStudents: number;
  class: {
    name: string;
    grade_level: string;
  };
}

interface SessionData {
  session: {
    name: string;
  };
  terms: Term[];
}

interface Attendance {
  term: string;
  days_present: number;
  days_open: number;
}

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
}

interface ResultData {
  student: Student;
  sessions: SessionData[];
  attendance: Attendance[];
}

/* ---------------------------------------------------
 * ✅ COMPONENT
 * --------------------------------------------------- */

const ReportCardPage = () => {
  const [showReportCard, setShowReportCard] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ResultData | null>(null);
  const [studentId, setStudentId] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [reportType, setReportType] = useState<"session" | "individual">(
    "individual"
  );
  const schoolName = useUserStore((s) => s.schoolName);

  /* ---------------------------------------------
   * ✅ Fetch student data
   * --------------------------------------------- */
  const { data: mockStudentData, isLoading } = useQuery<ResultData>({
    queryKey: ["results"],
    queryFn: async () => {
      const response = await axios.get("/api/result");
      return response.data.data as ResultData;
    },
  });

  /* ---------------------------------------------
   * ✅ Initialize selection on load
   * --------------------------------------------- */
  useEffect(() => {
    if (mockStudentData) {
      if (!studentId) {
        setStudentId(mockStudentData.student.student_id);
      }
      if (!selectedSession && mockStudentData.sessions.length > 0) {
        setSelectedSession(mockStudentData.sessions[0].session.name);
      }
    }
  }, [mockStudentData, studentId, selectedSession]);

  if (isLoading || !mockStudentData) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading student data...
      </div>
    );
  }

  /* ---------------------------------------------
   * ✅ Helpers
   * --------------------------------------------- */

  const currentSessionData = mockStudentData.sessions.find(
    (s) => s.session.name === selectedSession
  );

  const currentClass = currentSessionData?.terms[0]?.class ?? {
    name: "N/A",
    grade_level: "N/A",
  };

  const getTermAverage = (scores: SubjectScore[]): number => {
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, score) => acc + score.total_score, 0);
    return (total / (scores.length * 100)) * 100;
  };

  const handleViewReport = (
    termData: Term | null = null,
    sessionData: SessionData | null = null
  ) => {
    if (!mockStudentData) return;

    let reportData: ResultData = { ...mockStudentData };

    if (termData && currentSessionData) {
      const sessionIndex = mockStudentData.sessions.findIndex(
        (s) => s.session.name === selectedSession
      );

      reportData.sessions = [
        {
          ...mockStudentData.sessions[sessionIndex],
          terms: [termData],
        },
      ];

      reportData.attendance = [
        mockStudentData.attendance[
          mockStudentData.sessions[sessionIndex].terms.indexOf(termData)
        ],
      ];
    } else if (sessionData) {
      reportData.sessions = [sessionData];
      reportData.attendance = mockStudentData.attendance;
    }

    setSelectedData(reportData);
    setShowReportCard(true);
  };

  const getSessionStats = () => {
    if (!currentSessionData)
      return { averages: [], overall: 0, bestTerm: 0, improvement: 0 };

    const averages = currentSessionData.terms.map((term) =>
      getTermAverage(term.scores)
    );

    const overall = averages.length
      ? averages.reduce((acc, avg) => acc + avg, 0) / averages.length
      : 0;

    const bestTerm = averages.length ? Math.max(...averages) : 0;
    const improvement =
      averages.length >= 2 ? averages[averages.length - 1] - averages[0] : 0;

    return { averages, overall, bestTerm, improvement };
  };

  const sessionStats = getSessionStats();

  /* ---------------------------------------------
   * ✅ Render
   * --------------------------------------------- */
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Card</h1>
          <p className="text-gray-600">
            {schoolName} - Academic Records System
          </p>
        </div>

        {/* Session Selection Card */}
        <Card className="mb-8 border shadow-sm rounded-xl">
          <CardHeader className="bg-emerald-50/50 border-b px-6 py-4">
            <CardTitle className="flex items-center gap-3 text-emerald-900">
              <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-lg font-semibold">Select Session</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700">
                  Academic Session
                </Label>
                <Select
                  value={selectedSession}
                  onValueChange={setSelectedSession}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudentData.sessions.map((session) => (
                      <SelectItem
                        key={session.session.name}
                        value={session.session.name}
                      >
                        {session.session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700">Report Type</Label>
                <Select
                  value={reportType}
                  onValueChange={(v) =>
                    setReportType(v as "session" | "individual")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Complete Session</SelectItem>
                    <SelectItem value="individual">Individual Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Details Card */}
        <Card className="mb-8 border shadow-sm rounded-xl">
          <CardHeader className="bg-emerald-50/50 border-b px-6 py-4">
            <CardTitle className="flex items-center gap-3 text-emerald-900">
              <Award className="h-6 w-6 text-emerald-600" />
              <span className="text-lg font-semibold">Student Details</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  label: "Full Name",
                  value: `${mockStudentData.student.first_name} ${mockStudentData.student.last_name}`,
                },
                { label: "Current Class", value: currentClass.name },
                { label: "Grade Level", value: currentClass.grade_level },
                {
                  label: "Student ID",
                  value: mockStudentData.student.student_id,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col space-y-1">
                  <span className="text-xs uppercase tracking-wide text-gray-500">
                    {item.label}
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Performance Overview */}
        {currentSessionData && (
          <Card className="mb-8 border shadow-sm rounded-xl">
            <CardHeader className="bg-emerald-50/50 border-b px-6 py-4">
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <span className="text-lg font-semibold">
                  Session Performance Overview - {selectedSession}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Session Average
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {sessionStats.overall.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Best Term
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {sessionStats.bestTerm.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Improvement
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      sessionStats.improvement >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sessionStats.improvement >= 0 ? "+" : ""}
                    {sessionStats.improvement.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Total Terms
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {currentSessionData.terms.length}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Term-by-Term Progress</h4>
                <div className="flex justify-between items-end h-20">
                  {sessionStats.averages.map((avg, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-emerald-500 rounded-t w-12 mb-2 transition-all"
                        style={{ height: `${(avg / 100) * 60}px` }}
                      ></div>
                      <span className="text-xs font-semibold">
                        {currentSessionData.terms[index].name}
                      </span>
                      <span className="text-xs text-gray-600">
                        {avg.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Report Generation */}
        <Card className="border shadow-sm rounded-xl">
          <CardHeader className="bg-emerald-50/50 border-b px-6 py-4">
            <CardTitle className="text-emerald-900">Generate Reports</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-6">
            {reportType === "session" ? (
              <div className="text-center py-8">
                <Button
                  onClick={() => handleViewReport(null, currentSessionData)}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Generate & Print Complete Session Report
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentSessionData?.terms.map((term, index) => (
                  <Card
                    key={index}
                    className="border-2 hover:border-emerald-300 transition-all cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-emerald-800">
                        {term.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleViewReport(term)}
                        className="w-full"
                        variant="outline"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print {term.name} Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showReportCard && selectedData && (
        <ReportCard
          data={selectedData}
          onClose={() => setShowReportCard(false)}
        />
      )}
    </div>
  );
};

export default ReportCardPage;
