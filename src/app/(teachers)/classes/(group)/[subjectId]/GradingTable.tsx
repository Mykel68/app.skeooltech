"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { StudentScoreRow } from "./StudentScoreRow";
import { useForm, FormProvider } from "react-hook-form";

interface GradingComponent {
  name: string;
  weight: number;
}

interface StudentScore {
  component_name: string;
  score: number;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  scores?: StudentScore[];
}

interface Props {
  students: Student[];
  gradingComponents: GradingComponent[];
  onStudentClick?: (student: Student) => void;
}

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

export const GradingTable = ({
  students,
  gradingComponents,
  onStudentClick,
}: Props) => {
  const defaultValues = {
    students: students.reduce((acc, student) => {
      acc[student.user_id] = gradingComponents.reduce((compAcc, comp) => {
        const key = normalizeKey(comp.name);
        const existingScore = student.scores?.find(
          (s) => normalizeKey(s.component_name) === key
        );
        compAcc[key] = existingScore ? existingScore.score : 0;
        return compAcc;
      }, {} as Record<string, number>);
      return acc;
    }, {} as Record<string, Record<string, number>>),
  };

  const methods = useForm({ defaultValues });

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="h-[1.1rem]">
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                {gradingComponents.map((comp) => (
                  <TableCell key={comp.name}>
                    {comp.name} ({comp.weight}%)
                  </TableCell>
                ))}
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <StudentScoreRow
                  key={student.user_id}
                  student={student}
                  gradingComponents={gradingComponents}
                  register={register}
                  errors={errors}
                  control={control}
                  onClick={() => onStudentClick?.(student)}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </form>
    </FormProvider>
  );
};
