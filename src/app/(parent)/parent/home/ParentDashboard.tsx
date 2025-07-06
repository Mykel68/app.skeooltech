"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { GraduationCap, Users, Plus } from "lucide-react";
import { toast } from "sonner";

interface Child {
  id: string;
  name: string;
  grade: string;
  averageGrade: string;
  attendance: string;
  recentActivity: string[];
  upcomingEvents: string[];
}

// Mock API functions
const mockApi = {
  getChildren: async (): Promise<Child[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const stored = localStorage.getItem("linkedChildren");
    if (stored) {
      const children = JSON.parse(stored);
      return children.map((child: any, index: number) => ({
        ...child,
        averageGrade: ["A-", "B+", "A", "B-"][index % 4],
        attendance: ["98%", "94%", "96%", "92%"][index % 4],
        recentActivity: [
          "Submitted Math homework",
          "Participated in Science project",
          "Attended parent-teacher conference",
        ],
        upcomingEvents: [
          "Math test on Friday",
          "Science fair next week",
          "Field trip permission slip due",
        ],
      }));
    }
    return [];
  },
};

interface ParentDashboardProps {
  onLogout: () => void;
}

const ParentDashboard = ({ onLogout }: ParentDashboardProps) => {
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [showAddChild, setShowAddChild] = useState(false);

  const queryClient = useQueryClient();

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["children"],
    queryFn: mockApi.getChildren,
  });

  const handleChildAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["children"] });
    setShowAddChild(false);
    toast.success("Child Added Successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const currentChild =
    children.find((child) => child.id === selectedChild) || children[0];

  return (
    <div className="min-h-screen ">
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800">
                School Connect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowAddChild(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Child</span>
              </Button>
              <Button variant="outline" onClick={onLogout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Children
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
                            <p className="text-sm font-medium">{activity}</p>
                            <p className="text-xs text-gray-500">
                              {index + 1} day{index === 0 ? "" : "s"} ago
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

      {/* <AddChildDialog
        open={showAddChild}
        onClose={() => setShowAddChild(false)}
        onChildAdded={handleChildAdded}
      /> */}
    </div>
  );
};

export default ParentDashboard;
