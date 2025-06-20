"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { StudentReportData } from "./page";
import { getGradeColor } from "@/lib/grades";

const ReportCard = ({
  reportData,
  onClose,
}: {
  reportData: StudentReportData;
  onClose: () => void;
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const suffix = (p: number) =>
    p === 1 ? "st" : p === 2 ? "nd" : p === 3 ? "rd" : "th";

  const downloadReport = () => window.print();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-auto shadow-xl text-xs print:text-[10px]">
        {/* Header Controls */}
        <div className="sticky top-0 bg-white border-b p-2 flex justify-between items-center print:hidden z-10">
          <h3 className="text-sm font-semibold">Student Report Card</h3>
          <div className="flex gap-2">
            <Button onClick={downloadReport} size="sm">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Printable Report */}
        <div ref={reportRef} className="p-6 print:p-6">
          <div className="border-2 border-black p-4 bg-white text-black space-y-6">
            {/* School Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold uppercase">
                {reportData.school.name}
              </h1>
              <p className="text-sm text-gray-600">
                {reportData.school.address}
              </p>
              <h2 className="text-xl font-bold py-2">Terminal Report Card</h2>
              <div className="text-sm">
                Session: {reportData.session} | Term: {reportData.term}
              </div>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4">
              <table className="w-full border border-black">
                <tbody>
                  <tr>
                    <td className="border p-1 font-semibold">Full Name</td>
                    <td className="border p-1 uppercase">
                      {reportData.student.name}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1 font-semibold">Admission No</td>
                    <td className="border p-1">
                      {reportData.student.admissionNumber}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1 font-semibold">Class</td>
                    <td className="border p-1">{reportData.student.class}</td>
                  </tr>
                  <tr>
                    <td className="border p-1 font-semibold">Age</td>
                    <td className="border p-1">
                      {reportData.student.age || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="w-full border border-black">
                <thead>
                  <tr>
                    <th className="border p-1">Times Opened</th>
                    <th className="border p-1">Present</th>
                    <th className="border p-1">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-1 text-center">
                      {reportData.student.attendance.schoolOpened}
                    </td>
                    <td className="border p-1 text-center">
                      {reportData.student.attendance.timesPresent}
                    </td>
                    <td className="border p-1 text-center">
                      {reportData.student.attendance.timesAbsent}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subjects Table */}
            <table className="w-full border border-black text-center text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1">Subject</th>
                  <th className="border p-1">1st Test (20)</th>
                  <th className="border p-1">2nd Test (20)</th>
                  <th className="border p-1">Project (10)</th>
                  <th className="border p-1">Exam (50)</th>
                  <th className="border p-1">Total (100)</th>
                  <th className="border p-1">Grade</th>
                  <th className="border p-1">Position</th>
                  <th className="border p-1">Remark</th>
                </tr>
              </thead>
              <tbody>
                {reportData.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td className="border p-1 font-medium text-left">
                      {subject.name}
                    </td>
                    <td className="border p-1">
                      {subject.scores.firstTest.score}
                    </td>
                    <td className="border p-1">
                      {subject.scores.secondTest.score}
                    </td>
                    <td className="border p-1">
                      {subject.scores.project.score}
                    </td>
                    <td className="border p-1">{subject.scores.exam.score}</td>
                    <td className="border p-1 font-bold">{subject.total}</td>
                    <td
                      className={`border p-1 font-bold ${getGradeColor(
                        subject.grade
                      )}`}
                    >
                      {subject.grade}
                    </td>
                    <td className="border p-1">{subject.position}</td>
                    <td className="border p-1">{subject.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Table */}
            <table className="w-full border border-black text-sm mt-4">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Total Score:</td>
                  <td className="border p-2">
                    {reportData.summary.totalScore} /{" "}
                    {reportData.summary.totalPossible}
                  </td>
                  <td className="border p-2 font-semibold">Average:</td>
                  <td className="border p-2">{reportData.summary.average}%</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Position:</td>
                  <td className="border p-2">
                    {reportData.summary.position} out of{" "}
                    {reportData.summary.totalInClass}
                  </td>
                  <td className="border p-2 font-semibold">Grade:</td>
                  <td
                    className={`border p-2 font-bold ${getGradeColor(
                      reportData.summary.grade
                    )}`}
                  >
                    {reportData.summary.grade}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Comments */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-sm">
                  Class Teacher's Comment
                </label>
                <div className="border-b border-dashed border-gray-400 h-6">
                  {reportData.comments.classTeacher}
                </div>
                <div className="mt-2 text-xs">
                  Name: {reportData.classTeacher.name}
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-sm">
                  Principal's Comment
                </label>
                <div className="border-b border-dashed border-gray-400 h-6">
                  {reportData.comments.principal}
                </div>
                <div className="mt-2 text-xs">
                  Name: {reportData.principal.name}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
              This report was electronically generated and does not require a
              signature.
              <br />
              Printed on: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
