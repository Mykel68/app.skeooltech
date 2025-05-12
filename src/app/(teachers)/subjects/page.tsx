"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { ClassCard } from "@/components/cards/classCard";

type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
  const { data } = await axios.get(`/api/class/get-all-class/${schoolId}`);
  return data.data.classes;
}

export default function SubjectsPage() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const {
    data: classes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId),
    enabled: !!schoolId,
  });

  if (isLoading) return <p>Loading classes...</p>;
  if (error) return <p>Error loading classes.</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Subjects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classes?.map((cls) => (
          <ClassCard
            key={cls.class_id}
            id={cls.class_id}
            name={cls.name}
            grade_level={cls.grade_level}
          />
        ))}
      </div>
    </div>
  );
}
