"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  TrendingUp,
  Star,
  BarChart3,
  Download,
  Calendar,
  GraduationCap,
} from "lucide-react";

// Mock data for different terms and sessions with class information
const allResultsData = {
  "2022-2023": {
    class: "Grade 10A",
    "First Term": {
      subjects: [
        { name: "Mathematics", score: 78, grade: "B+" },
        { name: "Physics", score: 75, grade: "B+" },
        { name: "Chemistry", score: 72, grade: "B" },
        { name: "Biology", score: 80, grade: "A" },
        { name: "English", score: 77, grade: "B+" },
        { name: "Computer Science", score: 85, grade: "A" },
        { name: "Social Studies", score: 74, grade: "B+" },
      ],
      summary: {
        averageScore: 77.3,
        overallGrade: "B+",
        classRank: 8,
        passedSubjects: 7,
      },
    },
    "Mid Term": {
      subjects: [
        { name: "Mathematics", score: 80, grade: "A" },
        { name: "Physics", score: 78, grade: "B+" },
        { name: "Chemistry", score: 75, grade: "B+" },
        { name: "Biology", score: 82, grade: "A" },
        { name: "English", score: 79, grade: "B+" },
        { name: "Computer Science", score: 87, grade: "A" },
        { name: "Social Studies", score: 76, grade: "B+" },
      ],
      summary: {
        averageScore: 79.6,
        overallGrade: "B+",
        classRank: 7,
        passedSubjects: 7,
      },
    },
    "Final Term": {
      subjects: [
        { name: "Mathematics", score: 83, grade: "A" },
        { name: "Physics", score: 80, grade: "A" },
        { name: "Chemistry", score: 77, grade: "B+" },
        { name: "Biology", score: 85, grade: "A" },
        { name: "English", score: 81, grade: "A" },
        { name: "Computer Science", score: 89, grade: "A" },
        { name: "Social Studies", score: 78, grade: "B+" },
      ],
      summary: {
        averageScore: 81.9,
        overallGrade: "A",
        classRank: 6,
        passedSubjects: 7,
      },
    },
  },
  "2023-2024": {
    class: "Grade 11A",
    "First Term": {
      subjects: [
        { name: "Mathematics", score: 85, grade: "A" },
        { name: "Physics", score: 82, grade: "B+" },
        { name: "Chemistry", score: 78, grade: "B+" },
        { name: "Biology", score: 88, grade: "A" },
        { name: "English", score: 84, grade: "A" },
        { name: "Computer Science", score: 90, grade: "A+" },
        { name: "Social Studies", score: 80, grade: "B+" },
      ],
      summary: {
        averageScore: 83.9,
        overallGrade: "A",
        classRank: 5,
        passedSubjects: 7,
      },
    },
    "Mid Term": {
      subjects: [
        { name: "Mathematics", score: 88, grade: "A" },
        { name: "Physics", score: 85, grade: "A" },
        { name: "Chemistry", score: 82, grade: "B+" },
        { name: "Biology", score: 89, grade: "A" },
        { name: "English", score: 86, grade: "A" },
        { name: "Computer Science", score: 93, grade: "A+" },
        { name: "Social Studies", score: 81, grade: "B+" },
      ],
      summary: {
        averageScore: 86.3,
        overallGrade: "A",
        classRank: 4,
        passedSubjects: 7,
      },
    },
    "Final Term": {
      subjects: [
        { name: "Mathematics", score: 92, grade: "A+" },
        { name: "Physics", score: 88, grade: "A" },
        { name: "Chemistry", score: 85, grade: "A" },
        { name: "Biology", score: 90, grade: "A+" },
        { name: "English", score: 87, grade: "A" },
        { name: "Computer Science", score: 95, grade: "A+" },
        { name: "Social Studies", score: 82, grade: "B+" },
      ],
      summary: {
        averageScore: 88.4,
        overallGrade: "A",
        classRank: 3,
        passedSubjects: 7,
      },
    },
  },
  "2024-2025": {
    class: "Grade 12A",
    "First Term": {
      subjects: [
        { name: "Mathematics", score: 94, grade: "A+" },
        { name: "Physics", score: 90, grade: "A+" },
        { name: "Chemistry", score: 88, grade: "A" },
        { name: "Biology", score: 92, grade: "A+" },
        { name: "English", score: 89, grade: "A" },
        { name: "Computer Science", score: 96, grade: "A+" },
        { name: "Social Studies", score: 85, grade: "A" },
      ],
      summary: {
        averageScore: 90.6,
        overallGrade: "A+",
        classRank: 2,
        passedSubjects: 7,
      },
    },
    "Mid Term": {
      subjects: [
        { name: "Mathematics", score: 96, grade: "A+" },
        { name: "Physics", score: 92, grade: "A+" },
        { name: "Chemistry", score: 90, grade: "A+" },
        { name: "Biology", score: 94, grade: "A+" },
        { name: "English", score: 91, grade: "A+" },
        { name: "Computer Science", score: 98, grade: "A+" },
        { name: "Social Studies", score: 87, grade: "A" },
      ],
      summary: {
        averageScore: 92.6,
        overallGrade: "A+",
        classRank: 1,
        passedSubjects: 7,
      },
    },
  },
};

const studentInfo = {
  name: "Sarah Johnson",
};

const getGradeColor = (grade) => {
  const colors = {
    "A+": "bg-emerald-500 text-white",
    A: "bg-blue-500 text-white",
    "B+": "bg-yellow-500 text-white",
    B: "bg-orange-500 text-white",
    C: "bg-red-500 text-white",
  };
  return colors[grade] || "bg-gray-500 text-white";
};

const getScoreBarWidth = (score) => `${score}%`;

const getTrendIcon = (currentScore, previousScore) => {
  if (!previousScore) return null;
  if (currentScore > previousScore)
    return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (currentScore < previousScore)
    return (
      <div className="h-4 w-4 text-red-500 rotate-180">
        <TrendingUp />
      </div>
    );
  return <div className="h-4 w-4 text-gray-400">-</div>;
};

export default function StudentResultsReport() {
  const [selectedSession, setSelectedSession] = useState("2024-2025");
  const [selectedTerm, setSelectedTerm] = useState("Mid Term");
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const availableSessions = Object.keys(allResultsData);
  const availableTerms = Object.keys(
    allResultsData[selectedSession] || {}
  ).filter((key) => key !== "class");
  const currentData = allResultsData[selectedSession]?.[selectedTerm];
  const currentClass = allResultsData[selectedSession]?.class;

  // Get previous term data for comparison
  const getPreviousTermData = () => {
    const termOrder = ["First Term", "Mid Term", "Final Term"];
    const currentTermIndex = termOrder.indexOf(selectedTerm);

    if (currentTermIndex > 0) {
      const previousTerm = termOrder[currentTermIndex - 1];
      return allResultsData[selectedSession]?.[previousTerm];
    }
    // If it's the first term of current session, try to get final term of previous session
    if (currentTermIndex === 0) {
      const sessionKeys = Object.keys(allResultsData);
      const currentSessionIndex = sessionKeys.indexOf(selectedSession);
      if (currentSessionIndex > 0) {
        const previousSession = sessionKeys[currentSessionIndex - 1];
        return allResultsData[previousSession]?.["Final Term"];
      }
    }
    return null;
  };

  const previousData = getPreviousTermData();

  const handleSessionChange = (session) => {
    setIsLoading(true);
    setSelectedSession(session);
    // Reset to first available term when session changes
    const sessionTerms = Object.keys(allResultsData[session]).filter(
      (key) => key !== "class"
    );
    const firstTerm = sessionTerms[0];
    setSelectedTerm(firstTerm);

    setTimeout(() => setIsLoading(false), 500);
  };

  const handleTermChange = (term) => {
    setIsLoading(true);
    setSelectedTerm(term);
    setTimeout(() => setIsLoading(false), 300);
  };

  if (!currentData) {
    return (
      <div className="p-6 text-center">
        No data available for selected period
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600">
            {studentInfo.name} • {currentClass}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <Select value={selectedSession} onValueChange={handleSessionChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Session" />
              </SelectTrigger>
              <SelectContent>
                {availableSessions.map((session) => (
                  <SelectItem key={session} value={session}>
                    <div className="flex flex-col items-start">
                      <span>{session}</span>
                      <span className="text-xs text-gray-500">
                        {allResultsData[session].class}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={selectedTerm} onValueChange={handleTermChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                {availableTerms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading results...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Score</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-blue-600">
                        {currentData.summary.averageScore}%
                      </p>
                      {previousData &&
                        getTrendIcon(
                          currentData.summary.averageScore,
                          previousData.summary.averageScore
                        )}
                    </div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Grade</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {currentData.summary.overallGrade}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Class Rank</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-purple-600">
                        #{currentData.summary.classRank}
                      </p>
                      {previousData &&
                        getTrendIcon(
                          previousData.summary.classRank,
                          currentData.summary.classRank
                        )}
                    </div>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subjects Passed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {currentData.summary.passedSubjects}/7
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subject Results Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Subject Performance - {selectedTerm} {selectedSession}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.subjects.map((subject, index) => {
                  const previousSubject = previousData?.subjects.find(
                    (s) => s.name === subject.name
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {subject.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span className="text-lg font-semibold text-gray-700">
                                {subject.score}%
                              </span>
                              {previousSubject &&
                                getTrendIcon(
                                  subject.score,
                                  previousSubject.score
                                )}
                            </div>
                            <Badge className={getGradeColor(subject.grade)}>
                              {subject.grade}
                            </Badge>
                          </div>
                        </div>
                        {showDetails && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  subject.score >= 90
                                    ? "bg-emerald-500"
                                    : subject.score >= 80
                                    ? "bg-blue-500"
                                    : subject.score >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{
                                  width: getScoreBarWidth(subject.score),
                                }}
                              ></div>
                            </div>
                            {previousSubject && (
                              <p className="text-xs text-gray-500 mt-1">
                                Previous: {previousSubject.score}% (
                                {previousSubject.grade})
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["A+", "A", "B+", "B", "C"].map((grade) => {
                    const count = currentData.subjects.filter(
                      (s) => s.grade === grade
                    ).length;
                    const percentage =
                      (count / currentData.subjects.length) * 100;
                    return (
                      <div
                        key={grade}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            className={getGradeColor(grade)}
                            variant="secondary"
                          >
                            {grade}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {count} subjects
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Top Performing Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentData.subjects
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((subject, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : "bg-orange-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="font-medium">{subject.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {subject.score}%
                          </span>
                          <Badge className={getGradeColor(subject.grade)}>
                            {subject.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
