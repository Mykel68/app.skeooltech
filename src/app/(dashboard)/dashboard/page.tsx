"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  Bell,
  User,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Data = {
  class: {
    class_id: string;
    name: string;
    grade_level: string;
  };
  totalStudents: number;
  subject_list: {
    subject_id: string;
    name: string;
    short: string;
    teacher_name: string;
  };
  attendance_percentage: number;
};

type Subject = {
  subject_id: string;
  name: string;
  short: string;
  teacher_name: string;
};

type Assignment = {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  status: "pending" | "submitted" | "overdue";
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: "low" | "medium" | "high";
};

export default function StudentClassPage() {
  const studentName = useUserStore((s) => s.firstName);
  const schoolId = useUserStore((s) => s.schoolId);
  const studentId = useUserStore((s) => s.userId);
  const setUser = useUserStore((s) => s.setUser);
  // const [classId, setClassId] = useState<string | null>(null);

  const { data: Data, isLoading: isClassLoading } = useQuery<Data>({
    queryKey: ["studentData", schoolId, studentId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/student/details/${schoolId}/${studentId}`
      );
      setUser({
        class_id: data.data.class.class_id,
        class_name: data.data.class.name,
        class_grade_level: data.data.class.grade_level,
      });
      // setClassId(data.data.class_id);
      return data.data;
    },
    enabled: !!schoolId && !!studentId,
  });

  // const { data: subjectDetails, isLoading: isSubjectsLoading } = useQuery<
  //   Subject[]
  // >({
  //   queryKey: ["studentSubjects", schoolId, classId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/subject/by-student/${classId}`);
  //     console.log("studentSubjects", subjectDetails);
  //     return data.data;
  //   },
  //   enabled: !!schoolId && !!classId,
  // });

  const mockAssignments: Assignment[] = [
    {
      id: "1",
      title: "Algebra Problems Set 3",
      subject: "Mathematics",
      due_date: "2025-05-28",
      status: "pending",
    },
    {
      id: "2",
      title: "Essay on Climate Change",
      subject: "English",
      due_date: "2025-05-26",
      status: "overdue",
    },
    {
      id: "3",
      title: "Lab Report - Pendulum",
      subject: "Physics",
      due_date: "2025-05-30",
      status: "pending",
    },
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "Mid-term Exams Schedule",
      message:
        "Mid-term exams will begin on June 5th. Please check the detailed schedule.",
      date: "2025-05-23",
      priority: "high",
    },
    {
      id: "2",
      title: "Class Photo Session",
      message: "Class photos will be taken on Friday during break time.",
      date: "2025-05-22",
      priority: "medium",
    },
  ];

  if (isClassLoading) {
    return (
      <div className="py-2 max-w-6xl mx-auto space-y-6">
        {/* Skeleton for class header */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Skeleton className="h-10 w-32" />
              <Separator orientation="vertical" className="h-12" />
              <div className="flex gap-6">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for subjects */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skeleton for assignments */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/4" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full mb-3 rounded-lg" />
            ))}
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!Data) {
    return <p className="p-4">No class information found.</p>;
  }

  return (
    <div className="py-2 max-w-6xl mx-auto space-y-6">
      {/* Class Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Welcome, {studentName}</CardTitle>
              <p className="text-muted-foreground">Your class dashboard</p>
            </div>
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-left">
              <h3 className="text-xl font-semibold">{Data.class.name}</h3>
              <Badge variant="outline" className="mt-1">
                {Data.class.grade_level}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Classmates</span>
                </div>
                <p className="text-lg font-semibold">{Data.totalStudents}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Attendance</span>
                </div>
                <p className="text-lg font-semibold">
                  {Data.attendance_percentage}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Data.subject_list && (
                  <div
                    key={Data.subject_list.subject_id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {Data.subject_list.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {Data.subject_list.teacher_name}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Data.subject_list.short}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upcoming Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          assignment.status === "overdue"
                            ? "destructive"
                            : assignment.status === "submitted"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {assignment.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due:{" "}
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Assignments
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Timetable
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Contact Teacher
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Class Discussion
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border p-3 rounded-lg space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge
                      variant={
                        announcement.priority === "high"
                          ? "destructive"
                          : announcement.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
