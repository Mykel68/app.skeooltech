"use client";

import { useWatch, useFormContext } from "react-hook-form";
import { ScoreInput } from "@/components/ScoreInput";
import { TableRow, TableCell } from "@/components/ui/table";
import { useEffect } from "react";

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
  student: Student;
  gradingComponents: GradingComponent[];
  register: any;
  errors: any;
  control: any;
  onClick?: (student: Student) => void;
}

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

export const StudentScoreRow = ({
  student,
  gradingComponents,
  register,
  errors,
  control,
  onClick,
}: Props) => {
  const { setValue } = useFormContext();

  const watchedValues = useWatch({
    control,
    name: `students.${student.user_id}`,
  });

  useEffect(() => {
    gradingComponents.forEach((comp) => {
      const normalizedCompName = normalizeKey(comp.name);
      const existingScore = student.scores?.find(
        (s) => normalizeKey(s.component_name) === normalizedCompName
      );
      if (existingScore) {
        setValue(
          `students.${student.user_id}.${normalizedCompName}`,
          existingScore.score
        );
      }
    });
  }, [gradingComponents, student, setValue]);

  const total = gradingComponents.reduce((sum, comp) => {
    const normalizedCompName = normalizeKey(comp.name);
    const val = watchedValues?.[normalizedCompName];
    const num = typeof val === "number" ? val : parseFloat(val) || 0;
    return sum + (num > comp.weight ? comp.weight : num);
  }, 0);

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted"
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      <TableCell onClick={() => onClick?.(student)}>
        {student.first_name}
      </TableCell>
      <TableCell onClick={() => onClick?.(student)}>
        {student.last_name}
      </TableCell>

      {gradingComponents.map((comp) => {
        const normalizedCompName = normalizeKey(comp.name);
        return (
          <TableCell key={comp.name}>
            <ScoreInput
              name={`students.${student.user_id}.${normalizedCompName}`}
              register={register}
              error={errors?.students?.[student.user_id]?.[normalizedCompName]}
              max={comp.weight}
            />
          </TableCell>
        );
      })}

      <TableCell className="font-semibold">{total}</TableCell>
    </TableRow>
  );
};
