"use client";

import { Calendar, Check, X, Clock, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";

export default function Attendance() {
  const schoolId = useUserStore((s) => s.schoolId!);
  const userId = useUserStore((s) => s.userId!);

  const fetchAttendance = async () => {
    const res = await axios.get(
      `/api/attendance/student/${schoolId}/${userId}`
    );
    return res.data.data;
  };

  const { data: attendanceData = { daily: [], monthly: [] }, isLoading } =
    useQuery({
      queryKey: ["attendance"],
      queryFn: fetchAttendance,
    });

  const { daily: dailyAttendance, monthly: monthlyStats } = attendanceData;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="w-4 h-4 text-success" />;
      case "absent":
        return <X className="w-4 h-4 text-destructive" />;
      case "late":
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-success text-success-foreground">Present</Badge>
        );
      case "absent":
        return <Badge variant="destructive">Absent</Badge>;
      case "late":
        return (
          <Badge className="bg-warning text-warning-foreground">Late</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const totalDays =
    monthlyStats?.length > 0
      ? monthlyStats.reduce((sum: number, m: any) => sum + m.total, 0)
      : 0;

  const presentDays =
    monthlyStats?.length > 0
      ? monthlyStats.reduce((sum: number, m: any) => sum + m.present, 0)
      : 0;

  const overallPercentage =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          My Attendance
        </h1>
        <p className="text-muted-foreground">
          Track your daily school attendance
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {overallPercentage}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {presentDays} of {totalDays} days present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {monthlyStats?.[0]?.percentage ?? "—"}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyStats?.[0]
                ? `${monthlyStats[0].present} of ${monthlyStats[0].total} days`
                : "No data for this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {monthlyStats[0]?.absent}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Times Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">
              {monthlyStats[0]?.late}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Records</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>
                Your daily attendance marked by your class teacher
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyAttendance.map((record: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(record.status)}
                      <div>
                        <p className="font-medium">
                          {record.day}, {record.date}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Marked by {record.markedBy} at {record.time}
                          </p>
                          {record.reason && (
                            <p className="text-orange-600">
                              Reason: {record.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Attendance Summary
              </CardTitle>
              <CardDescription>
                Your attendance percentage by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyStats.map((month: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{month.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Present: {month.present} | Absent: {month.absent} |
                          Late: {month.late}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-2xl font-bold">
                          {month.percentage}%
                        </div>
                        <Badge
                          variant={
                            month.percentage >= 90
                              ? "default"
                              : month.percentage >= 75
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {month.percentage >= 90
                            ? "Excellent"
                            : month.percentage >= 75
                            ? "Good"
                            : "Poor"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={month.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
