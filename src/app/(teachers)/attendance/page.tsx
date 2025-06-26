"use client";

import { useUserStore } from "@/store/userStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Calendar, Users, BookOpen, CheckCircle } from "lucide-react";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import EmptyState from "./EmptyState";
import { Button } from "@/components/ui/button";

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  student_id?: string;
  present_days?: number;
}

interface AttendanceData {
  classDetails: {
    class: {
      class_id: string;
      name: string;
    };
  };
  students: Student[];
  total_school_days: number;
}

export default function AttendancePage() {
  const schoolId = useUserStore((s) => s.schoolId);
  const sessionId = useUserStore((s) => s.session_id);
  const termId = useUserStore((s) => s.term_id);
  const teacherId = useUserStore((s) => s.userId);

  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, number>
  >({});
  const [totalSchoolDays, setTotalSchoolDays] = useState<number>(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AttendanceData>({
    queryKey: ["get-teacher-classes", schoolId, sessionId, termId, teacherId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/class-teacher/atttendance/${schoolId}/${sessionId}/${termId}/${teacherId}`
      );
      const fetched = res.data.data.data;

      const initialAttendance: Record<string, number> = {};
      for (const student of fetched.students) {
        if (student.present_days !== undefined) {
          initialAttendance[student.user_id] = student.present_days;
        }
      }
      setAttendanceRecords(initialAttendance);
      setTotalSchoolDays(fetched.total_school_days);

      return fetched;
    },
    enabled: !!schoolId && !!sessionId && !!termId && !!teacherId,
  });

  const submitAttendanceMutation = useMutation({
    mutationFn: async () => {
      const attendanceData = Object.entries(attendanceRecords).map(
        ([studentId, daysAttended]) => ({
          student_id: studentId,
          days_present: daysAttended,
        })
      );

      await axios.post(
        `/api/attendance/submit-bulk/${schoolId}/${sessionId}/${termId}/${data?.classDetails.class.class_id}`,
        { attendances: attendanceData }
      );
    },
    onSuccess: () => {
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      queryClient.invalidateQueries({
        queryKey: [
          "get-teacher-classes",
          schoolId,
          sessionId,
          termId,
          teacherId,
        ],
      });
    },
    onError: (error) => {
      console.error("Failed to submit attendance:", error);
    },
  });

  const handleAttendanceChange = (studentId: string, days: string) => {
    const num = parseInt(days) || 0;
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: num,
    }));
  };

  const handleSubmitAttendance = () => {
    submitAttendanceMutation.mutate();
  };

  const getAttendanceStats = () => {
    const students = data?.students || [];
    const totalStudents = students.length;
    const recordedStudents = Object.keys(attendanceRecords).length;
    const totalDaysRecorded = Object.values(attendanceRecords).reduce(
      (sum, d) => sum + d,
      0
    );
    const averageAttendance =
      recordedStudents > 0
        ? (totalDaysRecorded / recordedStudents).toFixed(1)
        : "0";

    return {
      totalStudents,
      recordedStudents,
      totalDaysRecorded,
      averageAttendance,
    };
  };

  if (isLoading) return <LoadingState />;
  if (!data || !data.classDetails || !data.students?.length)
    return <EmptyState />;
  if (error) return <ErrorState />;

  const { classDetails, students } = data;
  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen p-1 lg:px-10 ">
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {classDetails.class.name} Attendance Record
                </h1>
                <p className="text-gray-600">{students.length} students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Days */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Total School Days (Auto-filled)
              </label>
              <input
                type="number"
                readOnly
                value={totalSchoolDays}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">
                This value is set automatically based on school records.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Total Students",
              icon: Users,
              value: stats.totalStudents,
            },
            {
              label: "Recorded",
              icon: CheckCircle,
              value: stats.recordedStudents,
              color: "text-green-600",
            },
            {
              label: "Total Days",
              icon: BookOpen,
              value: stats.totalDaysRecorded,
              color: "text-blue-600",
            },
            {
              label: "Average",
              icon: Calendar,
              value: stats.averageAttendance,
              color: "text-purple-600",
            },
          ].map(({ label, icon: Icon, value, color = "text-gray-900" }, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Icon className={`w-5 h-5 mr-2 ${color}`} />
                <div>
                  <p className="text-sm text-gray-600">{label}</p>
                  <p className={`text-xl font-semibold ${color}`}>{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Enter Days Attended
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Input the number of days each student attended school this term
            </p>
          </div>

          <div className="p-6 space-y-3">
            {students.map((student, i) => (
              <div
                key={student.user_id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xs font-medium text-green-600">
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {student.first_name[0]}
                      {student.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">
                      Days attended:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalSchoolDays || 200}
                      value={attendanceRecords[student.user_id] || ""}
                      onChange={(e) =>
                        handleAttendanceChange(student.user_id, e.target.value)
                      }
                      placeholder="0"
                      className="w-20 px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {totalSchoolDays > 0 &&
                    attendanceRecords[student.user_id] && (
                      <div className="text-sm text-gray-500">
                        (
                        {(
                          (attendanceRecords[student.user_id] /
                            totalSchoolDays) *
                          100
                        ).toFixed(1)}
                        %)
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Recorded: {stats.recordedStudents} of {stats.totalStudents}{" "}
              students
            </div>
            <div className="flex items-center space-x-3">
              {submitSuccess && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Attendance saved successfully!
                </div>
              )}
              <Button
                onClick={handleSubmitAttendance}
                disabled={
                  stats.recordedStudents === 0 ||
                  submitAttendanceMutation.isPending
                }
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  stats.recordedStudents === 0 ||
                  submitAttendanceMutation.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary"
                }`}
              >
                {submitAttendanceMutation.isPending
                  ? "Saving..."
                  : "Save Attendance Records"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
