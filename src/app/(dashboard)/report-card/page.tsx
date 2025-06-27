"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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

// Enhanced mock data with multiple sessions and 3 terms each
const mockStudentData = {
  student: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@school.edu",
    gender: "Male",
    student_id: "SS2024001",
  },
  school: {
    name: "Excellence Secondary School",
    address: "123 Education Avenue, Lagos State, Nigeria",
    phone_number: "+234-801-234-5678",
    motto: "Knowledge is Power",
    users: [{ email: "info@excellenceschool.edu" }],
  },
  sessions: [
    {
      session: { name: "2023/2024" },
      terms: [
        {
          name: "First Term",
          start_date: "2023-09-15",
          end_date: "2023-12-15",
          next_term_start_date: "2024-01-15",
          total_days: 65,
          overall_position: 5,
          totalStudents: 45,
          class: { name: "SS2A", grade_level: "SS2" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 85,
              subject_position: 3,
              average: 72,
              components: [
                { component_name: "CA", score: 34 },
                { component_name: "Exam", score: 51 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 78,
              subject_position: 7,
              average: 69,
              components: [
                { component_name: "CA", score: 31 },
                { component_name: "Exam", score: 47 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 82,
              subject_position: 4,
              average: 67,
              components: [
                { component_name: "CA", score: 33 },
                { component_name: "Exam", score: 49 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 76,
              subject_position: 8,
              average: 71,
              components: [
                { component_name: "CA", score: 30 },
                { component_name: "Exam", score: 46 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 88,
              subject_position: 2,
              average: 73,
              components: [
                { component_name: "CA", score: 35 },
                { component_name: "Exam", score: 53 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 71,
              subject_position: 12,
              average: 68,
              components: [
                { component_name: "CA", score: 28 },
                { component_name: "Exam", score: 43 },
              ],
            },
          ],
        },
        {
          name: "Second Term",
          start_date: "2024-01-15",
          end_date: "2024-04-15",
          next_term_start_date: "2024-04-29",
          total_days: 63,
          overall_position: 4,
          totalStudents: 45,
          class: { name: "SS2A", grade_level: "SS2" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 89,
              subject_position: 2,
              average: 74,
              components: [
                { component_name: "CA", score: 36 },
                { component_name: "Exam", score: 53 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 81,
              subject_position: 5,
              average: 71,
              components: [
                { component_name: "CA", score: 32 },
                { component_name: "Exam", score: 49 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 85,
              subject_position: 3,
              average: 69,
              components: [
                { component_name: "CA", score: 34 },
                { component_name: "Exam", score: 51 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 79,
              subject_position: 6,
              average: 73,
              components: [
                { component_name: "CA", score: 31 },
                { component_name: "Exam", score: 48 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 91,
              subject_position: 1,
              average: 75,
              components: [
                { component_name: "CA", score: 37 },
                { component_name: "Exam", score: 54 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 74,
              subject_position: 9,
              average: 70,
              components: [
                { component_name: "CA", score: 29 },
                { component_name: "Exam", score: 45 },
              ],
            },
          ],
        },
        {
          name: "Third Term",
          start_date: "2024-04-29",
          end_date: "2024-07-19",
          next_term_start_date: "2024-09-16",
          total_days: 60,
          overall_position: 3,
          totalStudents: 45,
          class: { name: "SS2A", grade_level: "SS2" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 92,
              subject_position: 1,
              average: 76,
              components: [
                { component_name: "CA", score: 38 },
                { component_name: "Exam", score: 54 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 84,
              subject_position: 4,
              average: 73,
              components: [
                { component_name: "CA", score: 33 },
                { component_name: "Exam", score: 51 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 87,
              subject_position: 2,
              average: 71,
              components: [
                { component_name: "CA", score: 35 },
                { component_name: "Exam", score: 52 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 82,
              subject_position: 5,
              average: 75,
              components: [
                { component_name: "CA", score: 32 },
                { component_name: "Exam", score: 50 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 94,
              subject_position: 1,
              average: 77,
              components: [
                { component_name: "CA", score: 39 },
                { component_name: "Exam", score: 55 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 77,
              subject_position: 8,
              average: 72,
              components: [
                { component_name: "CA", score: 30 },
                { component_name: "Exam", score: 47 },
              ],
            },
          ],
        },
      ],
    },
    {
      session: { name: "2022/2023" },
      terms: [
        {
          name: "First Term",
          start_date: "2022-09-15",
          end_date: "2022-12-15",
          next_term_start_date: "2023-01-15",
          total_days: 65,
          overall_position: 8,
          totalStudents: 42,
          class: { name: "SS1B", grade_level: "SS1" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 72,
              subject_position: 8,
              average: 68,
              components: [
                { component_name: "CA", score: 28 },
                { component_name: "Exam", score: 44 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 68,
              subject_position: 12,
              average: 65,
              components: [
                { component_name: "CA", score: 27 },
                { component_name: "Exam", score: 41 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 75,
              subject_position: 6,
              average: 63,
              components: [
                { component_name: "CA", score: 30 },
                { component_name: "Exam", score: 45 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 70,
              subject_position: 10,
              average: 67,
              components: [
                { component_name: "CA", score: 28 },
                { component_name: "Exam", score: 42 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 78,
              subject_position: 5,
              average: 69,
              components: [
                { component_name: "CA", score: 31 },
                { component_name: "Exam", score: 47 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 65,
              subject_position: 15,
              average: 64,
              components: [
                { component_name: "CA", score: 26 },
                { component_name: "Exam", score: 39 },
              ],
            },
          ],
        },
        {
          name: "Second Term",
          start_date: "2023-01-15",
          end_date: "2023-04-15",
          next_term_start_date: "2023-04-29",
          total_days: 63,
          overall_position: 6,
          totalStudents: 42,
          class: { name: "SS1B", grade_level: "SS1" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 76,
              subject_position: 6,
              average: 70,
              components: [
                { component_name: "CA", score: 30 },
                { component_name: "Exam", score: 46 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 72,
              subject_position: 9,
              average: 67,
              components: [
                { component_name: "CA", score: 29 },
                { component_name: "Exam", score: 43 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 79,
              subject_position: 4,
              average: 65,
              components: [
                { component_name: "CA", score: 32 },
                { component_name: "Exam", score: 47 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 74,
              subject_position: 7,
              average: 69,
              components: [
                { component_name: "CA", score: 29 },
                { component_name: "Exam", score: 45 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 82,
              subject_position: 3,
              average: 71,
              components: [
                { component_name: "CA", score: 33 },
                { component_name: "Exam", score: 49 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 69,
              subject_position: 11,
              average: 66,
              components: [
                { component_name: "CA", score: 27 },
                { component_name: "Exam", score: 42 },
              ],
            },
          ],
        },
        {
          name: "Third Term",
          start_date: "2023-04-29",
          end_date: "2023-07-19",
          next_term_start_date: "2023-09-16",
          total_days: 60,
          overall_position: 5,
          totalStudents: 42,
          class: { name: "SS1B", grade_level: "SS1" },
          scores: [
            {
              subject_name: "Mathematics",
              total_score: 80,
              subject_position: 4,
              average: 72,
              components: [
                { component_name: "CA", score: 32 },
                { component_name: "Exam", score: 48 },
              ],
            },
            {
              subject_name: "English Language",
              total_score: 75,
              subject_position: 7,
              average: 69,
              components: [
                { component_name: "CA", score: 30 },
                { component_name: "Exam", score: 45 },
              ],
            },
            {
              subject_name: "Physics",
              total_score: 83,
              subject_position: 3,
              average: 67,
              components: [
                { component_name: "CA", score: 33 },
                { component_name: "Exam", score: 50 },
              ],
            },
            {
              subject_name: "Chemistry",
              total_score: 77,
              subject_position: 6,
              average: 71,
              components: [
                { component_name: "CA", score: 31 },
                { component_name: "Exam", score: 46 },
              ],
            },
            {
              subject_name: "Biology",
              total_score: 85,
              subject_position: 2,
              average: 73,
              components: [
                { component_name: "CA", score: 34 },
                { component_name: "Exam", score: 51 },
              ],
            },
            {
              subject_name: "Geography",
              total_score: 72,
              subject_position: 9,
              average: 68,
              components: [
                { component_name: "CA", score: 29 },
                { component_name: "Exam", score: 43 },
              ],
            },
          ],
        },
      ],
    },
  ],
  attendance: [
    { days_present: 58, total_days: 65 },
    { days_present: 60, total_days: 63 },
    { days_present: 57, total_days: 60 },
  ],
};

const ReportCardPage = () => {
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [studentId, setStudentId] = useState("SS2024001");
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const [reportType, setReportType] = useState("session");

  const currentSessionData = mockStudentData.sessions.find(
    (s) => s.session.name === selectedSession
  );
  const currentClass = currentSessionData?.terms[0]?.class || {
    name: "N/A",
    grade_level: "N/A",
  };

  const handleViewReport = (termData = null, sessionData = null) => {
    let reportData = { ...mockStudentData };

    if (termData) {
      // Show specific term only
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
      // Show complete session
      const sessionIndex = mockStudentData.sessions.findIndex(
        (s) => s.session.name === selectedSession
      );
      reportData.sessions = [sessionData];
      reportData.attendance = mockStudentData.attendance;
    }

    setSelectedData(reportData);
    setShowReportCard(true);
  };

  const getTermAverage = (scores) => {
    const total = scores.reduce((acc, score) => acc + score.total_score, 0);
    return (total / (scores.length * 100)) * 100;
  };

  const getSessionStats = () => {
    if (!currentSessionData)
      return { averages: [], overall: 0, bestTerm: 0, improvement: 0 };

    const averages = currentSessionData.terms.map((term) =>
      getTermAverage(term.scores)
    );
    const overall =
      averages.reduce((acc, avg) => acc + avg, 0) / averages.length;
    const bestTerm = Math.max(...averages);
    const improvement = averages[averages.length - 1] - averages[0];

    return { averages, overall, bestTerm, improvement };
  };

  const sessionStats = getSessionStats();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Card</h1>
          <p className="text-gray-600">
            Excellence Secondary School - Academic Records System
          </p>
        </div>

        {/* Student Search & Session Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                S
              </div>
              Student Information & Session Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter Student ID"
                />
              </div>
              <div>
                <Label htmlFor="session">Academic Session</Label>
                <Select
                  value={selectedSession}
                  onValueChange={setSelectedSession}
                >
                  <SelectTrigger>
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
              <div>
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">
                      Complete Session (All Terms)
                    </SelectItem>
                    <SelectItem value="individual">Individual Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Student Info Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Full Name
                  </p>
                  <p className="font-bold">
                    {mockStudentData.student.first_name}{" "}
                    {mockStudentData.student.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Current Class
                  </p>
                  <p className="font-bold">{currentClass.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Grade Level
                  </p>
                  <p className="font-bold">{currentClass.grade_level}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">
                    Student ID
                  </p>
                  <p className="font-bold">
                    {mockStudentData.student.student_id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Performance Overview */}
        {currentSessionData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Session Performance Overview - {selectedSession}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm font-semibold text-gray-600">
                    Session Average
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
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

              {/* Term Averages Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Term-by-Term Progress</h4>
                <div className="flex justify-between items-end h-20">
                  {sessionStats.averages.map((avg, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="bg-blue-500 rounded-t w-12 mb-2"
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

        {/* Report Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {reportType === "session" ? (
              // Complete Session Report
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <Award className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-blue-800 mb-2">
                    Complete Session Report - {selectedSession}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive analysis of all 3 terms with performance
                    trends and insights
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-600">
                        Terms Completed
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {currentSessionData?.terms.length || 0}
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-600">
                        Session Average
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {sessionStats.overall.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white rounded p-3">
                      <p className="text-sm font-semibold text-gray-600">
                        Performance Trend
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          sessionStats.improvement >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sessionStats.improvement >= 0 ? "↗" : "↘"}{" "}
                        {Math.abs(sessionStats.improvement).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => handleViewReport(null, currentSessionData)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Generate & Print Complete Session Report
                </Button>
              </div>
            ) : (
              // Individual Term Reports
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentSessionData?.terms.map((term, index) => {
                  const average = getTermAverage(term.scores);
                  return (
                    <Card
                      key={index}
                      className="border-2 hover:border-emerald-300 transition-all cursor-pointer"
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800">
                          {term.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(term.start_date).toLocaleDateString()} -{" "}
                          {new Date(term.end_date).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-green-50 rounded p-3 text-center">
                            <p className="text-sm font-semibold text-gray-600">
                              Average
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {average.toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded p-3 text-center">
                            <p className="text-sm font-semibold text-gray-600">
                              Position
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                              {term.overall_position}/{term.totalStudents}
                            </p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            Subjects: {term.scores.length}
                          </p>
                          <div className="text-xs text-gray-500">
                            Best:{" "}
                            {
                              term.scores.reduce((best, current) =>
                                current.total_score > best.total_score
                                  ? current
                                  : best
                              ).subject_name
                            }
                          </div>
                        </div>
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
                  );
                })}
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
