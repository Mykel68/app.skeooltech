"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Star, BarChart3, Download } from "lucide-react";

// Mock data for dashboard report
const resultsData = {
  student: "Sarah Johnson",
  class: "12A",
  term: "Final Term 2024",
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
    totalSubjects: 7,
    averageScore: 88.4,
    overallGrade: "A",
    classRank: 3,
    passedSubjects: 7,
  },
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

export default function StudentResultsReport() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Results</h1>
          <p className="text-gray-600">
            {resultsData.student} • {resultsData.class} • {resultsData.term}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {resultsData.summary.averageScore}%
                </p>
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
                  {resultsData.summary.overallGrade}
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
                <p className="text-2xl font-bold text-purple-600">
                  #{resultsData.summary.classRank}
                </p>
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
                  {resultsData.summary.passedSubjects}/
                  {resultsData.summary.totalSubjects}
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
            <CardTitle>Subject Performance</CardTitle>
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
            {resultsData.subjects.map((subject, index) => (
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
                      <span className="text-lg font-semibold text-gray-700">
                        {subject.score}%
                      </span>
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
                          style={{ width: getScoreBarWidth(subject.score) }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
                const count = resultsData.subjects.filter(
                  (s) => s.grade === grade
                ).length;
                const percentage = (count / resultsData.subjects.length) * 100;
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
                          className="h-2 bg-blue-500 rounded-full"
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
            <CardTitle className="text-lg">Top Performing Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resultsData.subjects
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
                      <span className="font-semibold">{subject.score}%</span>
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
    </div>
  );
}
