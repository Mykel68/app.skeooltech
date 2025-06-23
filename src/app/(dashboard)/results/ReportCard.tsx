"use client";

import React, { useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

interface Props {
  data: any; // raw response passed in
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

const ReportCard = ({ data, onClose }: Props) => {
  const reportRef = useRef<HTMLDivElement>(null);
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

  // Calculate class statistics
  const totalStudents = 45; // This would come from your data
  const overallPosition = 5;

  const downloadReport = () => window.print();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto text-xs print:text-[10px]">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b p-2 flex justify-between items-center print:hidden z-10">
          <h3 className="text-sm font-semibold">Report Card</h3>
          <div className="flex gap-2">
            <Button onClick={downloadReport} size="sm">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div ref={reportRef} className="p-12 print-area">
          {/* School Header */}
          <div className="text-center border-b-4 border-blue-600 pb-6 mb-8">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {school.name.charAt(0)}
              </div>
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
                  <span className="font-semibold">Full Name:</span>
                  <span className="uppercase font-bold">
                    {student.first_name} {student.last_name}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Admission No:</span>
                  <span>{student.admissionNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Class:</span>
                  <span>{classInfo.name}</span>
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
                    <p className="text-2xl font-bold text-green-600">
                      {termData.total_days}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Present</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {attendance?.days_present}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Absent</p>
                    <p className="text-2xl font-bold text-red-600">
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
                  {scores.map((score, index) => {
                    const grade = getGrade(score.total_score);
                    const caScore =
                      score.components.find((c) => c.component_name === "CA")
                        ?.score || 0;
                    const examScore =
                      score.components.find((c) => c.component_name === "Exam")
                        ?.score || 0;

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
                          {score.position || "-"}
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
                      colSpan="4"
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

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 mb-8">
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
                    {scores.filter((s) => s.total_score >= 75).length} subjects
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Good (B2-B3):</span>
                  <span className="font-bold text-blue-600">
                    {
                      scores.filter(
                        (s) => s.total_score >= 65 && s.total_score < 75
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
                        (s) => s.total_score >= 50 && s.total_score < 65
                      ).length
                    }{" "}
                    subjects
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Pass/Fail (D7-F9):</span>
                  <span className="font-bold text-red-600">
                    {scores.filter((s) => s.total_score < 50).length} subjects
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-center bg-orange-600 text-white py-2 rounded mb-4">
              REMARKS & COMMENTS
            </h3>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold text-orange-800 mb-2">
                  Class Teacher's Remark:
                </h4>
                <p className="text-gray-700">
                  {getOverallRemark(average)} Sam shows dedication in
                  Mathematics and Science subjects. However, improvement is
                  needed in Language subjects. Regular practice and consultation
                  with subject teachers is recommended.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">
                  Principal's Remark:
                </h4>
                <p className="text-gray-700">
                  A commendable performance overall. The student demonstrates
                  good academic potential. Continue to maintain focus and strive
                  for excellence in all subjects.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">
                  Areas for Improvement:
                </h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Focus more on Language subjects (English & Yoruba)</li>
                  <li>
                    Improve attendance - only{" "}
                    {(
                      ((attendance?.days_present || 0) / termData.total_days) *
                      100
                    ).toFixed(1)}
                    % attendance
                  </li>
                  <li>Participate more actively in Creative Arts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t-2 border-gray-300">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mt-16">
                <p className="font-bold">Class Teacher</p>
                <p className="text-sm text-gray-600">Signature & Date</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mt-16">
                <p className="font-bold">Principal</p>
                <p className="text-sm text-gray-600">Signature & Date</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mt-16">
                <p className="font-bold">Parent/Guardian</p>
                <p className="text-sm text-gray-600">Signature & Date</p>
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
