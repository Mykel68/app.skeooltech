"use client";

import React, { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useReactToPrint } from "react-to-print";
import GradingSystem from "./GradingSystem";

interface Props {
  data: any; // raw response passed in
  onClose: () => void;
}

export interface User {
  last_name: string;
  first_name: string;
  gender: string;
  email: string;
}

export interface SchoolUser {
  email: string;
}

export interface School {
  name: string;
  address: string;
  phone_number: string;
  motto: string;
  users: SchoolUser[];
}

export interface Attendance {
  days_present: number;
  total_days: number;
}

export interface ScoreComponent {
  component_name: string;
  score: number;
}

export interface Score {
  subject_name: string;
  total_score: number;
  subject_position?: number | string;
  average: number;
  components: ScoreComponent[];
}

export interface ClassInfo {
  name: string;
  grade_level: string;
}

export interface TermData {
  name: string;
  start_date: string;
  end_date: string;
  next_term_start_date: string;
  total_days: number;
  scores: Score[];
  class: ClassInfo;
  overall_position: number;
  totalStudents: number;
}

export interface Session {
  session: {
    name: string;
  };
  terms: TermData[];
}

export interface ReportData {
  student: User;
  school: School;
  attendance?: Attendance[];
  sessions: Session[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getGrade(score: number): { grade: string; remark: string } {
  if (score >= 75) return { grade: "A1", remark: "Excellent" };
  if (score >= 70) return { grade: "B2", remark: "Very Good" };
  if (score >= 65) return { grade: "B3", remark: "Good" };
  if (score >= 60) return { grade: "C4", remark: "Credit" };
  if (score >= 55) return { grade: "C5", remark: "Credit" };
  if (score >= 50) return { grade: "C6", remark: "Credit" };
  if (score >= 45) return { grade: "D7", remark: "Pass" };
  if (score >= 40) return { grade: "E8", remark: "Pass" };
  return { grade: "F9", remark: "Fail" };
}

function getOverallRemark(average: number) {
  if (average >= 75)
    return "Outstanding performance! Keep up the excellent work.";
  if (average >= 65)
    return "Good performance. Continue to strive for excellence.";
  if (average >= 55)
    return "Satisfactory performance. There's room for improvement.";
  if (average >= 45)
    return "Fair performance. More effort needed in weak areas.";
  return "Poor performance. Requires serious attention and extra support.";
}

function getPerformanceInsights(scores: Score[], average: number): string[] {
  const excellentSubjects = scores.filter((s) => s.total_score >= 75);
  const goodSubjects = scores.filter(
    (s) => s.total_score >= 65 && s.total_score < 75
  );
  const weakSubjects = scores.filter((s) => s.total_score < 50);
  const bestSubject = scores.reduce((best, current) =>
    current.total_score > best.total_score ? current : best
  );
  const weakestSubject = scores.reduce((weakest, current) =>
    current.total_score < weakest.total_score ? current : weakest
  );

  const insights = [];

  // Best performance insight
  insights.push(
    `Strongest performance in ${bestSubject.subject_name} (${bestSubject.total_score}%)`
  );

  // Areas needing improvement
  if (weakSubjects.length > 0) {
    insights.push(
      `Needs improvement in ${weakestSubject.subject_name} (${weakestSubject.total_score}%)`
    );
  }

  // Overall performance category
  if (average >= 75) {
    insights.push("Consistently excellent across most subjects");
  } else if (average >= 65) {
    insights.push("Good overall performance with room for growth");
  } else if (average >= 50) {
    insights.push("Average performance, focus on weaker subjects");
  } else {
    insights.push("Below average performance, requires additional support");
  }

  return insights;
}

function getRecommendations(
  scores: Score[],
  average: number,
  attendance?: Attendance
): string[] {
  const recommendations = [];
  const weakSubjects = scores.filter((s) => s.total_score < 50);
  const attendanceRate = attendance
    ? (attendance.days_present / attendance.total_days) * 100
    : 100;

  // Academic recommendations
  if (average >= 75) {
    recommendations.push(
      "Continue the excellent work and maintain this high standard"
    );
    recommendations.push(
      "Consider taking on leadership roles in academic activities"
    );
  } else if (average >= 65) {
    recommendations.push("Focus on improving performance in weaker subjects");
    recommendations.push("Seek additional practice in challenging topics");
  } else if (average >= 50) {
    recommendations.push(
      "Dedicate more time to studying, especially in weak subjects"
    );
    recommendations.push("Consider forming study groups with classmates");
  } else {
    recommendations.push(
      "Requires immediate academic intervention and support"
    );
    recommendations.push(
      "Regular consultation with subject teachers recommended"
    );
  }

  // Subject-specific recommendations
  if (weakSubjects.length > 0) {
    const subjectNames = weakSubjects
      .slice(0, 2)
      .map((s) => s.subject_name)
      .join(" and ");
    recommendations.push(`Pay special attention to ${subjectNames}`);
  }

  // Attendance recommendations
  if (attendanceRate < 90) {
    recommendations.push(
      "Improve school attendance for better academic performance"
    );
  }

  return recommendations;
}

const ReportCard = ({ data, onClose }: Props) => {
  const schoolImage = useUserStore((s) => s.schoolImage);

  // Safely guard against undefined data
  if (!data) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded shadow max-w-md w-full text-center">
          <p className="text-red-600 font-medium">
            Invalid or missing report data.
          </p>
          <Button variant="outline" className="mt-4" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  const student = data.student;
  const school = data.school;
  const termData = data.sessions[0].terms[0];
  const classInfo = termData.class;
  const scores = termData.scores;
  const attendance = data.attendance?.[0];

  const totalScore = scores.reduce(
    (acc: number, s: any) => acc + s.total_score,
    0
  );
  const totalPossible = scores.length * 100;
  const average = (totalScore / totalPossible) * 100;
  const overallGrade = getGrade(average);
  const overallRemark = getOverallRemark(average);
  const performanceInsights = getPerformanceInsights(scores, average);
  const recommendations = getRecommendations(scores, average, attendance);

  // Calculate class statistics
  const totalStudents = termData.overall_position; // This would come from your data
  const overallPosition = termData.totalStudents;
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto text-xs print:text-[10px]">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b p-2 flex justify-between items-center print:hidden z-10">
          <h3 className="text-sm font-semibold">Report Card</h3>
          <div className="flex gap-2">
            <Button onClick={reactToPrintFn} size="sm">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div
          ref={contentRef}
          className="p-12 print-area print:p-4 print:text-xs"
        >
          {/* School Header */}
          <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
            <div className="flex items-center justify-center gap-8 mb-4">
              {schoolImage ? (
                <img
                  src={schoolImage}
                  alt="School Logo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {school?.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-blue-800 uppercase mb-2">
                  {school.name}
                </h1>
                <p className="text-gray-600 max-w-md">{school.address}</p>
                <p className="text-gray-600">
                  Tel: {school.phone_number} | Email: {school.users[0].email}
                </p>
                <p className="italic text-blue-600 font-semibold mt-2">
                  "{school.motto}"
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-28 aspect-square bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-lg flex flex-col items-center justify-center text-center shadow-lg">
                  <div className="p-2 font-bold text-xl border-b-2 border-white/30 w-full text-center">
                    {classInfo?.grade_level || "N/A"}
                  </div>
                  <div className="p-2 font-semibold text-sm">
                    {termData?.name || "Term"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 py-3 px-6 rounded-lg">
              <h2 className="text-xl font-bold text-blue-800">
                CONTINUOUS ASSESSMENT REPORT
              </h2>
              <p className="text-blue-600 font-semibold">
                {data.sessions[0].session.name} Academic Session -{" "}
                {termData.name}
              </p>
            </div>
          </div>

          {/* Student Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 mb-8">
            {/* Student Personal Data */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-center bg-blue-600 text-white py-2 rounded mb-4">
                STUDENT'S PERSONAL DATA
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Last Name:</span>
                  <span className="uppercase font-bold">
                    {student.last_name}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold uppercase">First Name:</span>
                  <span>{student.first_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Class:</span>
                  <span>{classInfo.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Grade Level:</span>
                  <span>{classInfo.grade_level}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Gender:</span>
                  <span>{student.gender}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Email:</span>
                  <span>{student.email}</span>
                </div>
              </div>
            </div>

            {/* Attendance & Term Info */}
            <div className="space-y-4">
              {/* Attendance */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-center bg-green-600 text-white py-2 rounded mb-4">
                  ATTENDANCE RECORD
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-semibold text-sm">School Days</p>
                    <p className="text-3xl font-bold text-green-600">
                      {termData.total_days}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Present</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {attendance?.days_present}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Absent</p>
                    <p className="text-3xl font-bold text-red-600">
                      {termData.total_days - (attendance?.days_present || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Term Dates */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-center bg-yellow-600 text-white py-2 rounded mb-4">
                  TERM DURATION
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Term Begins:</span>
                    <span>{formatDate(termData.start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Term Ends:</span>
                    <span>{formatDate(termData.end_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Next Term:</span>
                    <span>{formatDate(termData.next_term_start_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grading System */}
          <GradingSystem />
          {/* Academic Performance */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center bg-red-600 text-white py-2 rounded mb-4">
              ACADEMIC PERFORMANCE RECORD
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border border-gray-300 p-2">S/N</th>
                    <th className="border border-gray-300 p-2">Subject</th>
                    <th className="border border-gray-300 p-2">CA (40%)</th>
                    <th className="border border-gray-300 p-2">Exam (60%)</th>
                    <th className="border border-gray-300 p-2">Total (100%)</th>
                    <th className="border border-gray-300 p-2">Grade</th>
                    <th className="border border-gray-300 p-2">Remark</th>
                    <th className="border border-gray-300 p-2">Position</th>
                    <th className="border border-gray-300 p-2">Class Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score: Score, index: number) => {
                    const grade = getGrade(score.total_score);
                    const caScore =
                      score.components.find(
                        (c: ScoreComponent) => c.component_name === "CA"
                      )?.score || 0;
                    const examScore =
                      score.components.find(
                        (c: ScoreComponent) => c.component_name === "Exam"
                      )?.score || 0;

                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 p-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 font-medium">
                          {score.subject_name}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {caScore}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {examScore}
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-bold">
                          {score.total_score}
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-bold text-blue-600">
                          {grade.grade}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {grade.remark}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {score.subject_position || "-"}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {score.average}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-blue-100 font-bold">
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-300 p-2 text-center"
                    >
                      TOTAL SCORES
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-lg">
                      {totalScore}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-lg">
                      {overallGrade.grade}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {overallGrade.remark}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {overallPosition}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {average.toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Dynamic Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-center bg-blue-600 text-white py-2 rounded mb-4">
                PERFORMANCE SUMMARY
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Total Score:</span>
                  <span className="font-bold">
                    {totalScore}/{totalPossible}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Average Score:</span>
                  <span className="font-bold">{average.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Overall Grade:</span>
                  <span className="font-bold text-blue-600">
                    {overallGrade.grade}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Class Position:</span>
                  <span className="font-bold">
                    {overallPosition} of {totalStudents}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Subjects Offered:</span>
                  <span className="font-bold">{scores.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-center bg-green-600 text-white py-2 rounded mb-4">
                SUBJECT ANALYSIS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Excellent (A1):</span>
                  <span className="font-bold text-green-600">
                    {scores.filter((s: Score) => s.total_score >= 75).length}{" "}
                    subjects
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Good (B2-B3):</span>
                  <span className="font-bold text-blue-600">
                    {
                      scores.filter(
                        (s: Score) => s.total_score >= 65 && s.total_score < 75
                      ).length
                    }{" "}
                    subjects
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Credit (C4-C6):</span>
                  <span className="font-bold text-yellow-600">
                    {
                      scores.filter(
                        (s: Score) => s.total_score >= 50 && s.total_score < 65
                      ).length
                    }{" "}
                    subjects
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Pass/Fail (D7-F9):</span>
                  <span className="font-bold text-red-600">
                    {scores.filter((s: Score) => s.total_score < 50).length}{" "}
                    subjects
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-center bg-orange-600 text-white py-2 rounded mb-4">
                PERFORMANCE INSIGHTS
              </h3>
              <div className="space-y-2">
                <div className="mb-3">
                  <p className="font-semibold text-orange-800 mb-2">
                    Overall Assessment:
                  </p>
                  <p className="text-sm italic bg-orange-100 p-2 rounded">
                    "{overallRemark}"
                  </p>
                </div>
                <div className="space-y-1">
                  {performanceInsights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-xs">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center bg-indigo-600 text-white py-2 rounded mb-4">
              RECOMMENDATIONS FOR IMPROVEMENT
            </h3>
            <div className="bg-indigo-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-indigo-800 mb-3">
                    Academic Focus Areas:
                  </h4>
                  <ul className="space-y-2">
                    {recommendations
                      .slice(0, Math.ceil(recommendations.length / 2))
                      .map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2">▸</span>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-800 mb-3">
                    Next Steps:
                  </h4>
                  <ul className="space-y-2">
                    {recommendations
                      .slice(Math.ceil(recommendations.length / 2))
                      .map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-indigo-600 mr-2">▸</span>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-8 border-t mt-8">
            <p>
              This report was generated electronically on{" "}
              {new Date().toLocaleDateString("en-GB")} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
            <p className="mt-1">
              For inquiries, contact the school administration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
