"use client";

import React, { useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGrade } from "@/lib/grades";

interface Props {
  data: any; // raw response passed in
  onClose: () => void;
}

const ReportCard = ({ data, onClose }: Props) => {
  const reportRef = useRef<HTMLDivElement>(null);

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

  const downloadReport = () => window.print();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-auto shadow-xl text-sm print:text-[10px]">
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

        {/* Report Body */}
        <div ref={reportRef} className="p-6 print:p-4 text-black">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold uppercase">{school.name}</h1>
            <p className="text-gray-700 whitespace-pre-line">
              {school.address}
            </p>
            <h2 className="text-lg font-semibold py-2">Terminal Report Card</h2>
            <p>
              Session: {data.sessions[0].session.name} | Term: {termData.name}
            </p>
          </div>

          {/* Student Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Full Name:</span>{" "}
                {student.first_name} {student.last_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {student.email}
              </p>
              <p>
                <span className="font-semibold">Class:</span> {classInfo.name}
              </p>
              <p>
                <span className="font-semibold">Grade Level:</span>{" "}
                {classInfo.grade_level}
              </p>
            </div>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Times Opened:</span> 3
              </p>
              <p>
                <span className="font-semibold">Present:</span>{" "}
                {attendance?.days_present ?? 0}
              </p>
              <p>
                <span className="font-semibold">Absent:</span>{" "}
                {3 - (attendance?.days_present ?? 0)}
              </p>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="mt-6">
            <table className="w-full border border-black text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1">Subject</th>
                  <th className="border p-1">Total Score</th>
                  <th className="border p-1">Grade</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((subject: any, idx: number) => (
                  <tr key={subject.subject_id}>
                    <td className="border p-1 text-left">
                      {subject.subject_name}
                    </td>
                    <td className="border p-1 font-semibold">
                      {subject.total_score}
                    </td>
                    <td className="border p-1">
                      {getGrade(subject.total_score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 border-t pt-4 text-sm">
            <p>
              <span className="font-semibold">Total Score:</span> {totalScore} /{" "}
              {totalPossible}
            </p>
            <p>
              <span className="font-semibold">Average:</span>{" "}
              {average.toFixed(2)}%
            </p>
            <p>
              <span className="font-semibold">Overall Grade:</span>{" "}
              {getGrade(average)}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-6 border-t mt-4">
            This report was generated electronically.
            <br />
            Printed on: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
