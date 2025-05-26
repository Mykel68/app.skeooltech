"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BookOpen,
  User,
  Clock,
  FileText,
  Download,
  Mail,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Star,
  ChevronRight,
} from "lucide-react";

type Subject = {
  subject_id: string;
  name: string;
  short: string;
  teacher_name: string;
  teacher_email?: string;
  description?: string;
  credits?: number;
  schedule?: {
    day: string;
    time: string;
    room: string;
  }[];
};

type Assignment = {
  id: string;
  title: string;
  due_date: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
  max_grade?: number;
};

type Resource = {
  id: string;
  title: string;
  type: "pdf" | "doc" | "ppt" | "video" | "link";
  uploaded_date: string;
  size?: string;
};

type Grade = {
  id: string;
  assessment_name: string;
  grade: number;
  max_grade: number;
  date: string;
  type: "test" | "assignment" | "quiz" | "project";
};

export default function StudentSubjectsPage() {
  const studentName = useUserStore((s) => s.firstName);
  const schoolId = useUserStore((s) => s.schoolId);
  const studentId = useUserStore((s) => s.userId);

  const { data: classDetails, isLoading } = useQuery({
    queryKey: ["studentClass", schoolId],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/student/class/details/${schoolId}/${studentId}`
      );
      return data.data;
    },
    enabled: !!schoolId,
  });

  // Mock subjects data - replace with actual API calls
  const mockSubjects: Subject[] = [
    {
      subject_id: "1",
      name: "Mathematics",
      short: "MATH",
      teacher_name: "Mr. Johnson",
      teacher_email: "johnson@school.edu",
      description:
        "Advanced algebra, calculus, and statistical analysis for senior secondary students.",
      credits: 4,
      schedule: [
        { day: "Monday", time: "9:00 AM - 10:30 AM", room: "Room 101" },
        { day: "Wednesday", time: "9:00 AM - 10:30 AM", room: "Room 101" },
        { day: "Friday", time: "2:00 PM - 3:30 PM", room: "Room 101" },
      ],
    },
    {
      subject_id: "2",
      name: "English Language",
      short: "ENG",
      teacher_name: "Mrs. Smith",
      teacher_email: "smith@school.edu",
      description:
        "Literature analysis, creative writing, and advanced grammar for effective communication.",
      credits: 3,
      schedule: [
        { day: "Tuesday", time: "10:30 AM - 12:00 PM", room: "Room 205" },
        { day: "Thursday", time: "10:30 AM - 12:00 PM", room: "Room 205" },
      ],
    },
    {
      subject_id: "3",
      name: "Physics",
      short: "PHY",
      teacher_name: "Dr. Brown",
      teacher_email: "brown@school.edu",
      description:
        "Mechanics, thermodynamics, and modern physics with practical laboratory work.",
      credits: 4,
      schedule: [
        { day: "Monday", time: "1:00 PM - 2:30 PM", room: "Physics Lab" },
        { day: "Thursday", time: "1:00 PM - 2:30 PM", room: "Physics Lab" },
      ],
    },
    {
      subject_id: "4",
      name: "Chemistry",
      short: "CHEM",
      teacher_name: "Ms. Davis",
      teacher_email: "davis@school.edu",
      description:
        "Organic and inorganic chemistry with emphasis on practical applications.",
      credits: 4,
      schedule: [
        { day: "Tuesday", time: "2:00 PM - 3:30 PM", room: "Chemistry Lab" },
        { day: "Friday", time: "10:30 AM - 12:00 PM", room: "Chemistry Lab" },
      ],
    },
    {
      subject_id: "5",
      name: "Biology",
      short: "BIO",
      teacher_name: "Mr. Wilson",
      teacher_email: "wilson@school.edu",
      description: "Cell biology, genetics, ecology, and human physiology.",
      credits: 3,
      schedule: [
        { day: "Wednesday", time: "2:00 PM - 3:30 PM", room: "Biology Lab" },
      ],
    },
  ];

  // Mock data for subject details
  const getSubjectAssignments = (subjectId: string): Assignment[] => {
    const assignments: Record<string, Assignment[]> = {
      "1": [
        {
          id: "1",
          title: "Calculus Problem Set 5",
          due_date: "2025-05-28",
          status: "pending",
        },
        {
          id: "2",
          title: "Statistics Project",
          due_date: "2025-06-02",
          status: "pending",
        },
        {
          id: "3",
          title: "Algebra Quiz",
          due_date: "2025-05-20",
          status: "graded",
          grade: 85,
          max_grade: 100,
        },
      ],
      "2": [
        {
          id: "4",
          title: "Shakespeare Essay",
          due_date: "2025-05-30",
          status: "pending",
        },
        {
          id: "5",
          title: "Poetry Analysis",
          due_date: "2025-05-15",
          status: "submitted",
        },
      ],
      "3": [
        {
          id: "6",
          title: "Lab Report - Pendulum",
          due_date: "2025-05-29",
          status: "pending",
        },
        {
          id: "7",
          title: "Thermodynamics Problems",
          due_date: "2025-06-01",
          status: "pending",
        },
      ],
    };
    return assignments[subjectId] || [];
  };

  const getSubjectResources = (subjectId: string): Resource[] => {
    const resources: Record<string, Resource[]> = {
      "1": [
        {
          id: "1",
          title: "Calculus Reference Guide",
          type: "pdf",
          uploaded_date: "2025-05-20",
          size: "2.5 MB",
        },
        {
          id: "2",
          title: "Statistics Formulas",
          type: "pdf",
          uploaded_date: "2025-05-18",
          size: "1.2 MB",
        },
        {
          id: "3",
          title: "Practice Problems",
          type: "doc",
          uploaded_date: "2025-05-15",
          size: "800 KB",
        },
      ],
      "2": [
        {
          id: "4",
          title: "Shakespeare Study Guide",
          type: "pdf",
          uploaded_date: "2025-05-22",
          size: "3.1 MB",
        },
        {
          id: "5",
          title: "Grammar Rules",
          type: "doc",
          uploaded_date: "2025-05-10",
          size: "1.5 MB",
        },
      ],
      "3": [
        {
          id: "6",
          title: "Physics Lab Manual",
          type: "pdf",
          uploaded_date: "2025-05-19",
          size: "4.2 MB",
        },
        {
          id: "7",
          title: "Lecture Slides - Wave Motion",
          type: "ppt",
          uploaded_date: "2025-05-17",
          size: "2.8 MB",
        },
      ],
    };
    return resources[subjectId] || [];
  };

  const getSubjectGrades = (subjectId: string): Grade[] => {
    const grades: Record<string, Grade[]> = {
      "1": [
        {
          id: "1",
          assessment_name: "Mid-term Exam",
          grade: 88,
          max_grade: 100,
          date: "2025-05-10",
          type: "test",
        },
        {
          id: "2",
          assessment_name: "Assignment 1",
          grade: 92,
          max_grade: 100,
          date: "2025-05-05",
          type: "assignment",
        },
        {
          id: "3",
          assessment_name: "Quiz 1",
          grade: 85,
          max_grade: 100,
          date: "2025-04-28",
          type: "quiz",
        },
      ],
      "2": [
        {
          id: "4",
          assessment_name: "Essay Writing",
          grade: 78,
          max_grade: 100,
          date: "2025-05-12",
          type: "assignment",
        },
        {
          id: "5",
          assessment_name: "Literature Quiz",
          grade: 91,
          max_grade: 100,
          date: "2025-05-08",
          type: "quiz",
        },
      ],
    };
    return grades[subjectId] || [];
  };

  const getSubjectAverage = (subjectId: string): number => {
    const grades = getSubjectGrades(subjectId);
    if (grades.length === 0) return 0;
    const total = grades.reduce(
      (sum, grade) => sum + (grade.grade / grade.max_grade) * 100,
      0
    );
    return Math.round(total / grades.length);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄";
      case "doc":
        return "📝";
      case "ppt":
        return "📊";
      case "video":
        return "🎥";
      case "link":
        return "🔗";
      default:
        return "📁";
    }
  };

  if (isLoading) {
    return <p className="p-4">Loading subjects...</p>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Subjects</h1>
          <p className="text-muted-foreground">
            {classDetails?.name} - {classDetails?.grade_level}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Subjects</p>
          <p className="text-2xl font-bold">{mockSubjects.length}</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubjects.map((subject) => {
          const average = getSubjectAverage(subject.subject_id);
          const assignments = getSubjectAssignments(subject.subject_id);
          const pendingAssignments = assignments.filter(
            (a) => a.status === "pending"
          ).length;

          return (
            <Card
              key={subject.subject_id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                      <Badge variant="outline">{subject.short}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="text-lg font-semibold text-primary">
                      {average}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Teacher Info */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {subject.teacher_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {subject.teacher_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {subject.credits} Credits
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="font-semibold">{pendingAssignments}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-2">
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="font-semibold">
                      {subject.schedule?.length || 0}/week
                    </p>
                  </div>
                </div>

                {/* Subject Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Subject View */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Details</CardTitle>
          <p className="text-muted-foreground">
            Select a subject to view detailed information
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mathematics" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {mockSubjects.map((subject) => (
                <TabsTrigger
                  key={subject.subject_id}
                  value={subject.name.toLowerCase().replace(/\s+/g, "")}
                >
                  {subject.short}
                </TabsTrigger>
              ))}
            </TabsList>

            {mockSubjects.map((subject) => (
              <TabsContent
                key={subject.subject_id}
                value={subject.name.toLowerCase().replace(/\s+/g, "")}
                className="space-y-6"
              >
                {/* Subject Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{subject.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      {subject.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Current Average
                    </p>
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-2xl font-bold">
                        {getSubjectAverage(subject.subject_id)}%
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Assignments */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Assignments
                      </h3>
                      <div className="space-y-3">
                        {getSubjectAssignments(subject.subject_id).map(
                          (assignment) => (
                            <div
                              key={assignment.id}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {assignment.status === "graded" ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : assignment.status === "submitted" ? (
                                  <Clock className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-orange-500" />
                                )}
                                <div>
                                  <h4 className="font-medium">
                                    {assignment.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Due:{" "}
                                    {new Date(
                                      assignment.due_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    assignment.status === "graded"
                                      ? "default"
                                      : assignment.status === "submitted"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {assignment.status}
                                </Badge>
                                {assignment.grade && (
                                  <p className="text-sm font-medium mt-1">
                                    {assignment.grade}/{assignment.max_grade}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Study Materials
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getSubjectResources(subject.subject_id).map(
                          (resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-2xl">
                                {getFileIcon(resource.type)}
                              </span>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {resource.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {resource.size} •{" "}
                                  {new Date(
                                    resource.uploaded_date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Teacher Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Teacher
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar>
                            <AvatarFallback>
                              {subject.teacher_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {subject.teacher_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {subject.teacher_email}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Class Schedule
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {subject.schedule?.map((schedule, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-primary pl-3"
                            >
                              <p className="font-medium text-sm">
                                {schedule.day}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {schedule.time}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {schedule.room}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Grades */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Recent Grades
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {getSubjectGrades(subject.subject_id)
                            .slice(0, 3)
                            .map((grade) => (
                              <div
                                key={grade.id}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {grade.assessment_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {grade.type}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">
                                    {grade.grade}/{grade.max_grade}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {Math.round(
                                      (grade.grade / grade.max_grade) * 100
                                    )}
                                    %
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          View All Grades
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
