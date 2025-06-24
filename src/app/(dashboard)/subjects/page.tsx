"use client";

import { useState } from "react";
import { Book, GraduationCap, Search, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
}

const subjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MTH201",
    teacher: "Mr. Adebayo Johnson",
  },
  {
    id: "2",
    name: "English Language",
    code: "ENG201",
    teacher: "Mrs. Fatima Ibrahim",
  },
  {
    id: "3",
    name: "Physics",
    code: "PHY201",
    teacher: "Dr. Chinedu Okafor",
  },
  {
    id: "4",
    name: "Chemistry",
    code: "CHM201",
    teacher: "Mrs. Kemi Adeolu",
  },
  {
    id: "5",
    name: "Biology",
    code: "BIO201",
    teacher: "Mr. Emeka Nwosu",
  },
  {
    id: "6",
    name: "Government",
    code: "GOV201",
    teacher: "Mr. Audu Salihu",
  },
  {
    id: "7",
    name: "Economics",
    code: "ECO201",
    teacher: "Mrs. Blessing Okoro",
  },
  {
    id: "8",
    name: "Geography",
    code: "GEO201",
    teacher: "Mr. Yakubu Mohammed",
  },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter((subject) => {
    return (
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen ">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Subjects</h2>
          <p className="text-gray-600">SS2 Subject List with Teachers</p>
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

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
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
                  {subject.code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {subject.teacher}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
