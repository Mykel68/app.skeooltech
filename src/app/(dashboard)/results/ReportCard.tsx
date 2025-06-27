"use client";

import React, { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

interface Props {
  data: any;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getGrade(score) {
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

function getOverallRemark(average) {
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

function getPerformanceInsights(scores, average) {
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

function getRecommendations(scores, average, attendance) {
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
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    const element = contentRef.current;
    const student = data.student;

    const options = {
      margin: 0.2,
      filename: `${student.first_name}_${student.last_name}_Report.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

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
  const sessionData = data.sessions[0];
  const terms = sessionData.terms;
  const isSessionReport = terms.length > 1;

  // Get session statistics if multiple terms
  const getSessionStats = () => {
    if (!isSessionReport) return null;

    const termAverages = terms.map((term) => {
      const total = term.scores.reduce(
        (acc, score) => acc + score.total_score,
        0
      );
      return (total / (term.scores.length * 100)) * 100;
    });

    const sessionAverage =
      termAverages.reduce((acc, avg) => acc + avg, 0) / termAverages.length;
    const bestTermIndex = termAverages.indexOf(Math.max(...termAverages));
    const improvement = termAverages[termAverages.length - 1] - termAverages[0];

    return { termAverages, sessionAverage, bestTermIndex, improvement };
  };

  const sessionStats = getSessionStats();

  // For session reports, combine all subjects across terms
  const getCombinedSubjects = () => {
    if (!isSessionReport) return terms[0].scores;

    const subjectMap = new Map();

    terms.forEach((term, termIndex) => {
      term.scores.forEach((score) => {
        if (!subjectMap.has(score.subject_name)) {
          subjectMap.set(score.subject_name, {
            subject_name: score.subject_name,
            terms: new Array(terms.length).fill(null),
          });
        }
        subjectMap.get(score.subject_name).terms[termIndex] = score;
      });
    });

    return Array.from(subjectMap.values());
  };

  const combinedSubjects = getCombinedSubjects();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-auto text-xs print:text-[10px]">
        {/* Print Controls */}
        <div className="sticky top-0 bg-white border-b p-2 flex justify-between items-center print:hidden z-10">
          <h3 className="text-sm font-semibold">
            {isSessionReport
              ? `Session Report - ${sessionData.session.name}`
              : `${terms[0].name} Report`}
          </h3>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} size="sm" variant="secondary">
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
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
                    {terms[0].class?.grade_level || "N/A"}
                  </div>
                  <div className="p-2 font-semibold text-sm">
                    {isSessionReport ? "SESSION" : terms[0]?.name || "Term"}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 py-3 px-6 rounded-lg">
              <h2 className="text-xl font-bold text-blue-800">
                {isSessionReport
                  ? "COMPLETE SESSION REPORT"
                  : "CONTINUOUS ASSESSMENT REPORT"}
              </h2>
              <p className="text-blue-600 font-semibold">
                {sessionData.session.name} Academic Session
                {!isSessionReport && ` - ${terms[0].name}`}
              </p>
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 mb-8">
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
                  <span className="font-semibold">First Name:</span>
                  <span>{student.first_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Class:</span>
                  <span>{terms[0].class.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Grade Level:</span>
                  <span>{terms[0].class.grade_level}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Gender:</span>
                  <span>{student.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Student ID:</span>
                  <span>{student.student_id}</span>
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
                      {terms[0].total_days}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Present</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {data.attendance?.[0]?.days_present ||
                        terms[0].total_days}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Absent</p>
                    <p className="text-3xl font-bold text-red-600">
                      {terms[0].total_days -
                        (data.attendance?.[0]?.days_present ||
                          terms[0].total_days)}
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
                    <span>{formatDate(terms[0].start_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Term Ends:</span>
                    <span>{formatDate(terms[0].end_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Next Term:</span>
                    <span>{formatDate(terms[0].next_term_start_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grading System */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center bg-purple-600 text-white py-2 rounded mb-4">
              GRADING SYSTEM
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="border border-gray-300 p-2">Grade</th>
                    <th className="border border-gray-300 p-2">A1</th>
                    <th className="border border-gray-300 p-2">B2</th>
                    <th className="border border-gray-300 p-2">B3</th>
                    <th className="border border-gray-300 p-2">C4</th>
                    <th className="border border-gray-300 p-2">C5</th>
                    <th className="border border-gray-300 p-2">C6</th>
                    <th className="border border-gray-300 p-2">D7</th>
                    <th className="border border-gray-300 p-2">E8</th>
                    <th className="border border-gray-300 p-2">F9</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold">
                      Score
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      75-100
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      70-74
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      65-69
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      60-64
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      55-59
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      50-54
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      45-49
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      40-44
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      0-39
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2 font-semibold">
                      Remark
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Excellent
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Very Good
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Good
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Credit
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Credit
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Credit
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Pass
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Pass
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      Fail
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Single Combined Academic Performance Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center bg-red-600 text-white py-2 rounded mb-4">
              {isSessionReport
                ? "SESSION ACADEMIC PERFORMANCE"
                : "ACADEMIC PERFORMANCE RECORD"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-red-100">
                  <tr>
                    <th className="border border-gray-300 p-2">S/N</th>
                    <th className="border border-gray-300 p-2">Subject</th>
                    {isSessionReport ? (
                      // Session report - show all terms
                      terms.map((term, index) => (
                        <React.Fragment key={index}>
                          <th
                            className="border border-gray-300 p-2 bg-blue-50"
                            colSpan={3}
                          >
                            {term.name}
                          </th>
                        </React.Fragment>
                      ))
                    ) : (
                      // Single term report
                      <>
                        <th className="border border-gray-300 p-2">CA (40%)</th>
                        <th className="border border-gray-300 p-2">
                          Exam (60%)
                        </th>
                        <th className="border border-gray-300 p-2">
                          Total (100%)
                        </th>
                        <th className="border border-gray-300 p-2">Grade</th>
                        <th className="border border-gray-300 p-2">Remark</th>
                        <th className="border border-gray-300 p-2">Position</th>
                        <th className="border border-gray-300 p-2">
                          Class Avg
                        </th>
                      </>
                    )}
                    {isSessionReport && (
                      <>
                        <th className="border border-gray-300 p-2 bg-green-50">
                          Session Avg
                        </th>
                        <th className="border border-gray-300 p-2 bg-green-50">
                          Grade
                        </th>
                        <th className="border border-gray-300 p-2 bg-green-50">
                          Remark
                        </th>
                      </>
                    )}
                  </tr>
                  {isSessionReport && (
                    <tr>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      {terms.map((_, index) => (
                        <React.Fragment key={index}>
                          <th className="border border-gray-300 p-2 text-xs">
                            CA+Exam
                          </th>
                          <th className="border border-gray-300 p-2 text-xs">
                            Grade
                          </th>
                          <th className="border border-gray-300 p-2 text-xs">
                            Pos
                          </th>
                        </React.Fragment>
                      ))}
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-2"></th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {combinedSubjects.map((subject, index) => {
                    let sessionTotal = 0;
                    let validTerms = 0;

                    if (isSessionReport) {
                      subject.terms.forEach((termScore) => {
                        if (termScore) {
                          sessionTotal += termScore.total_score;
                          validTerms++;
                        }
                      });
                    }

                    const sessionAverage =
                      validTerms > 0 ? sessionTotal / validTerms : 0;
                    const sessionGrade = getGrade(sessionAverage);

                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 p-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 font-medium">
                          {subject.subject_name}
                        </td>

                        {isSessionReport ? (
                          // Session report - show all terms
                          <>
                            {subject.terms.map((termScore, termIndex) => (
                              <React.Fragment key={termIndex}>
                                <td className="border border-gray-300 p-2 text-center">
                                  {termScore ? termScore.total_score : "-"}
                                </td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-blue-600">
                                  {termScore
                                    ? getGrade(termScore.total_score).grade
                                    : "-"}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                  {termScore
                                    ? termScore.subject_position || "-"
                                    : "-"}
                                </td>
                              </React.Fragment>
                            ))}
                            <td className="border border-gray-300 p-2 text-center font-bold bg-green-50">
                              {sessionAverage.toFixed(1)}
                            </td>
                            <td className="border border-gray-300 p-2 text-center font-bold text-blue-600 bg-green-50">
                              {sessionGrade.grade}
                            </td>
                            <td className="border border-gray-300 p-2 text-center bg-green-50">
                              {sessionGrade.remark}
                            </td>
                          </>
                        ) : (
                          // Single term report
                          (() => {
                            const score = terms[0].scores.find(
                              (s) => s.subject_name === subject.subject_name
                            );
                            const grade = getGrade(score.total_score);
                            const caScore =
                              score.components.find(
                                (c) => c.component_name === "CA"
                              )?.score || 0;
                            const examScore =
                              score.components.find(
                                (c) => c.component_name === "Exam"
                              )?.score || 0;

                            return (
                              <>
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
                              </>
                            );
                          })()
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Session Summary for multi-term reports */}
          {isSessionReport && sessionStats && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-center bg-purple-600 text-white py-2 rounded mb-4">
                SESSION PERFORMANCE ANALYSIS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3">
                    Term-by-Term Progress
                  </h4>
                  <div className="space-y-2">
                    {terms.map((term, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{term.name}:</span>
                        <span className="font-bold text-purple-600">
                          {sessionStats.termAverages[index].toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-bold text-purple-800 mb-3">
                    Session Insights
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Best Performance:</strong>{" "}
                      {terms[sessionStats.bestTermIndex].name}
                    </p>
                    <p>
                      <strong>Consistency:</strong>{" "}
                      {Math.max(...sessionStats.termAverages) -
                        Math.min(...sessionStats.termAverages) <
                      10
                        ? "Consistent"
                        : "Variable"}
                    </p>
                    <p>
                      <strong>Trend:</strong>{" "}
                      {sessionStats.improvement >= 0
                        ? "Improving"
                        : "Declining"}
                    </p>
                    <p>
                      <strong>Overall Grade:</strong>{" "}
                      {getGrade(sessionStats.sessionAverage).grade} -{" "}
                      {getGrade(sessionStats.sessionAverage).remark}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-8 border-t mt-8">
            <p>
              This report was generated on{" "}
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
