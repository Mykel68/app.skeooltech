"use client";

import React, { useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGrade } from "@/lib/grades";
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
          <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-6">
            {/* School Logo - Far Left */}
            <div className="flex-shrink-0 w-24">
              <img
                src={schoolImage}
                alt="School Logo"
                className="w-24 aspect-square object-cover rounded"
              />
            </div>

            {/* School Info - Centered */}
            <div className="flex-1 px-4 text-center max-w-2xl">
              <p className="font-bold text-3xl mb-2 text-balance uppercase">
                {school.name}
              </p>
              <p className="text-sm text-balance">{school.address}</p>
              <p className="text-sm">
                Tel: {school.phone_number} | Email: {school.users[0].email}
              </p>
              <p className="italic text-sm mt-1">"{school.motto}"</p>
              <i className="text-lg font-semibold mt-2">
                Continuous Assessment Report - {data.sessions[0].session.name} /{" "}
                {termData.name}
              </i>
            </div>

            {/* Grade Info - Far Right */}
            <div className="flex-shrink-0 pl-4 ml-4">
              <div className="w-24 aspect-square bg-primary text-white rounded flex flex-col items-center justify-center text-center">
                <div className="p-1 font-bold text-lg border-b-4 border-black-100 w-full text-center">
                  {classInfo.grade_level}
                </div>
                <div className="p-1 font-semibold text-sm">{termData.name}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Student Personal data */}
            <div className="space-y-3">
              <div className="font-bold p-1 text-sm text-center border border">
                STUDENT'S PERSONAL DATA
              </div>
              <table className="w-full border border-black mb-4">
                <tbody>
                  <tr>
                    <td className="border p-1">
                      <strong className="text-sm">FULL NAME</strong>{" "}
                    </td>
                    <td className="border p-1">
                      <strong className="uppercase text-sm">
                        {student.first_name} {student.last_name}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1">
                      <strong className="text-sm">LAST NAME:</strong>{" "}
                    </td>
                    <td className="border p-1">
                      <strong className="text-sm">{student.last_name}</strong>{" "}
                    </td>
                  </tr>

                  <tr>
                    <td className="border p-1">
                      <strong className="text-sm">ADM NO:</strong>{" "}
                    </td>
                    <td className="border p-1">
                      <strong className="text-sm">
                        {student.admissionNumber}
                      </strong>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1">
                      <strong className="text-sm">CLASS:</strong>{" "}
                    </td>
                    <td className="border p-1">
                      <strong className="text-sm">{classInfo.name}</strong>{" "}
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-1">
                      <strong className="text-sm">SEX:</strong>{" "}
                    </td>
                    <td className="border p-1">
                      <strong className="text-sm">
                        {student.admissionNumber}
                      </strong>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-1">
              {/* Attendance */}
              <div className="space-y-1">
                <div className="font-bold p-1 text-sm text-center border border">
                  ATTENDANCE
                </div>
                <table className="w-full border border-black mb-4">
                  <tbody>
                    <tr>
                      <td className="border p-1 text-sm text-center">
                        <strong>Times Sch. Opened</strong>{" "}
                      </td>
                      <td className="border p-1 text-sm text-center">
                        <strong className="">Times Present</strong>
                      </td>
                      <td className="border p-1 text-sm text-center">
                        <strong className="">Times Absent</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-1 text-center">
                        {attendance.days_present ?? "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {student.attendance?.timesPresent ?? "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {student.attendance?.timesAbsent ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Term */}
              <div className="space-y-1">
                <div className="font-bold p-1 text-center text-sm border border">
                  TERMINAL DURATION WEEKS
                </div>
                <table className="w-full border border-black mb-4">
                  <tbody>
                    <tr>
                      <td className="border p-1 text-center text-sm">
                        <strong>Term Begins</strong>{" "}
                      </td>
                      <td className="border p-1 text-center text-sm">
                        <strong className="">Term Ends</strong>
                      </td>
                      <td className="border p-1 text-center text-sm">
                        <strong className="">Next Term Begins</strong>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-1 text-center">
                        {formatDate(termData.start_date) ?? "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {formatDate(termData.end_date) ?? "N/A"}
                      </td>
                      <td className="border p-1 text-center">
                        {formatDate(termData.nextTermBegins) ?? "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Grade */}
          <div className="space-y-1">
            <div className="font-bold p-1 text-center border border">
              GRADES
            </div>
            <table className="w-full border border-black mb-4 text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-1">A1</th>
                  <th className="border p-1">B2</th>
                  <th className="border p-1">B3</th>
                  <th className="border p-1">C4</th>
                  <th className="border p-1">C5</th>
                  <th className="border p-1">C6</th>
                  <th className="border p-1">D7</th>
                  <th className="border p-1">E8</th>
                  <th className="border p-1">F9</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-1">75 - 100</td>
                  <td className="border p-1">70 - 74</td>
                  <td className="border p-1">65 - 69</td>
                  <td className="border p-1">60 - 64</td>
                  <td className="border p-1">55 - 59</td>
                  <td className="border p-1">50 - 54</td>
                  <td className="border p-1">45 - 49</td>
                  <td className="border p-1">40 - 44</td>
                  <td className="border p-1">0 - 39</td>
                </tr>
                <tr>
                  <td className="border p-1">Excellent</td>
                  <td className="border p-1">Very Good</td>
                  <td className="border p-1">Good</td>
                  <td className="border p-1">Credit</td>
                  <td className="border p-1">Credit</td>
                  <td className="border p-1">Credit</td>
                  <td className="border p-1">Pass</td>
                  <td className="border p-1">Pass</td>
                  <td className="border p-1">Fail</td>
                </tr>
              </tbody>
            </table>
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
