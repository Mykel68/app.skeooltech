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

export default function Attendance() {
  const dailyAttendance = [
    {
      date: "2024-01-22",
      day: "Monday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-19",
      day: "Friday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-18",
      day: "Thursday",
      status: "absent",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
      reason: "Sick leave",
    },
    {
      date: "2024-01-17",
      day: "Wednesday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-16",
      day: "Tuesday",
      status: "late",
      markedBy: "Ms. Johnson",
      time: "08:45 AM",
    },
    {
      date: "2024-01-15",
      day: "Monday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-12",
      day: "Friday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-11",
      day: "Thursday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-10",
      day: "Wednesday",
      status: "present",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
    },
    {
      date: "2024-01-09",
      day: "Tuesday",
      status: "absent",
      markedBy: "Ms. Johnson",
      time: "08:30 AM",
      reason: "Medical appointment",
    },
  ];

  const monthlyStats = [
    {
      month: "January 2024",
      present: 18,
      absent: 2,
      late: 1,
      total: 21,
      percentage: 86,
    },
    {
      month: "December 2023",
      present: 19,
      absent: 1,
      late: 0,
      total: 20,
      percentage: 95,
    },
    {
      month: "November 2023",
      present: 20,
      absent: 2,
      late: 1,
      total: 23,
      percentage: 87,
    },
    {
      month: "October 2023",
      present: 21,
      absent: 1,
      late: 0,
      total: 22,
      percentage: 95,
    },
  ];

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

  const totalDays = monthlyStats.reduce((sum, month) => sum + month.total, 0);
  const presentDays = monthlyStats.reduce(
    (sum, month) => sum + month.present,
    0
  );
  const overallPercentage = Math.round((presentDays / totalDays) * 100);

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
              {monthlyStats[0].percentage}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthlyStats[0].present} of {monthlyStats[0].total} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Days Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {monthlyStats[0].absent}
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
              {monthlyStats[0].late}
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
                {dailyAttendance.map((record, index) => (
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
                {monthlyStats.map((month, index) => (
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
