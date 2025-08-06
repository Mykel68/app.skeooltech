"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Award } from "lucide-react";

interface Score {
  component_name: string;
  score: number;
}

interface Result {
  scores: Score[];
}

interface Activity {
  title: string;
  date: string;
}

interface Child {
  id: string;
  name: string;
  grade: string;
  averageGrade: string;
  attendance: string;
  results: Result[];
  recentActivity: Activity[];
  upcomingEvents: string[];
}

// API CALL: get linked children from backend
const fetchLinkedChildren = async (): Promise<Child[]> => {
  const { data } = await axios.get("/api/parent/get-link-child");

  const childrenData = data.data.children;

  const announcements = childrenData.school?.announcements || [];

  return childrenData.students.map((student: any) => {
    const scores = student.results?.[0]?.scores || [];

    const average =
      scores.length > 0
        ? (
            scores.reduce((acc: number, curr: any) => acc + curr.score, 0) /
            scores.length
          ).toFixed(1)
        : "0";

    return {
      id: student.user_id,
      name: student.full_name,
      grade: student.class,
      averageGrade: `${average}%`,
      attendance: "N/A",
      results: student.results ?? [],
      recentActivity: announcements.map((a: any) => ({
        title: a.title,
        date: a.sent_at,
      })),
      upcomingEvents: [],
    };
  });
};

const ParentDashboard = () => {
  const [selectedChild, setSelectedChild] = useState<string>("");

  const {
    data: children = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["children"],
    queryFn: fetchLinkedChildren,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load your linked children. Please try again later.</p>
        </div>
      </div>
    );
  }

  const currentChild =
    children.find((child) => child.id === selectedChild) || children[0];

  return (
    <div className="min-h-screen ">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Ward<span className="text-[1rem]">(s)</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {children.map((child) => (
              <Button
                key={child.id}
                variant={
                  selectedChild === child.id ||
                  (selectedChild === "" && child === children[0])
                    ? "default"
                    : "outline"
                }
                onClick={() => setSelectedChild(child.id)}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>{child.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {child.grade}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {currentChild && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {currentChild.averageGrade}
                  </div>
                  <p className="text-sm text-gray-600">Current Average Grade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentChild.attendance}
                  </div>
                  <p className="text-sm text-gray-600">This Semester</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    On Track
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Performing well academically
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Subject Performance
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of {currentChild.name}'s scores by
                  assessment type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentChild.results?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentChild.results[0]?.scores.map((score, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted/30 rounded-lg border border-muted"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {score.component_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Assessment Score
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {score.score}
                            </div>
                            {/* <Badge
                              variant={
                                score.score >= 80
                                  ? "default"
                                  : score.score >= 60
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs mt-1"
                            >
                              {score.score >= 80
                                ? "Excellent"
                                : score.score >= 60
                                ? "Good"
                                : "Needs Work"}
                            </Badge> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No score data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates from {currentChild.name}'s school
                      activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentChild.recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">
                              {activity.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>
                      Important dates and deadlines for {currentChild.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentChild.upcomingEvents.map((event, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400"
                        >
                          <div>
                            <p className="text-sm font-medium">{event}</p>
                            <p className="text-xs text-gray-500">
                              In {index + 3} days
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
