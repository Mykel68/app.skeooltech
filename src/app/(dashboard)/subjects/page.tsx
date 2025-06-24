"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Book, Search, Users } from "lucide-react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";

interface ApiSubject {
  subject_id: string;
  name: string;
  short: string;
  teacher: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const classId = useUserStore((s) => s.class_id);
  const gradeLevel = useUserStore((s) => s.class_grade_level);

  const {
    data: subjects = [],
    isLoading,
    isError,
  } = useQuery<ApiSubject[]>({
    queryKey: ["studentSubjects", classId],
    queryFn: async () => {
      const res = await axios.get(`/api/subject/by-student/${classId}`);
      return res.data.data;
    },
    enabled: !!classId,
  });

  const filteredSubjects = subjects.filter((subject) =>
    [subject.name, subject.short, subject.teacher?.username]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Subjects</h2>
          <p className="text-gray-600">
            {gradeLevel} Subject List with Teachers
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subjects, codes, or teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conditional display */}
        {isLoading ? (
          <p className="text-gray-500">Loading subjects...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load subjects.</p>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <Card
                key={subject.subject_id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-blue-500"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription className="font-mono text-sm font-medium">
                    {subject.short}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {` ${subject.teacher?.first_name} ${subject.teacher?.last_name} ` ||
                      "No teacher assigned"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
