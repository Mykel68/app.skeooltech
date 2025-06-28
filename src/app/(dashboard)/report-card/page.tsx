"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ReportCardPage = () => {
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [reportType, setReportType] = useState("session");

  const { data: mockStudentData, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const response = await axios.get(`/api/result`);
      // console.log("→ mockStudentData:", response.data);
      return response.data.data;
    },
  });

  useEffect(() => {
    if (mockStudentData) {
      if (!studentId) {
        setStudentId(mockStudentData.student.student_id);
      }
      if (!selectedSession && mockStudentData.sessions.length > 0) {
        setSelectedSession(mockStudentData.sessions[0].session.name);
      }
    }
  }, [mockStudentData]);

  if (isLoading || !mockStudentData) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading student data...
      </div>
    );
  }

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
      // Specific term only
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
      // Complete session
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 space-y-2">
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
                    {mockStudentData.sessions?.map((session) => (
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
