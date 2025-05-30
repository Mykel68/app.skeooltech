"use client";

import { useWatch } from "react-hook-form";
import { ScoreInput } from "@/components/ScoreInput";
import { TableRow, TableCell } from "@/components/ui/table";
import { useEffect } from "react";

interface Props {
  student: any;
  gradingComponents: { name: string; weight: number }[];
  register: any;
  errors: any;
  control: any;
  onClick?: (student: any) => void;
}

export const StudentScoreRow = ({
  student,
  gradingComponents,
  register,
  errors,
  control,
  onClick,
}: Props) => {
  const watchedValues = useWatch({
    control,
    name: `students.${student.user_id}`,
  });

  useEffect(() => {
    console.log("Student data:", student);
    // console.log("Watched values:", watchedValues);
  }, [student, watchedValues]);

  const total = gradingComponents.reduce((sum, comp) => {
    const val = watchedValues?.[comp.name] ?? 0;
    const num = Number(val) || 0;
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
      {gradingComponents.map((comp) => (
        <TableCell key={comp.name}>
          <ScoreInput
            name={`students.${student.user_id}.${comp.name}`}
            register={register}
            error={errors?.students?.[student.user_id]?.[comp.name]}
            max={comp.weight}
            value={student.scores?.find((s) => s.component_name === comp.name)}
          />
        </TableCell>
      ))}
      <TableCell className="font-semibold">{total}</TableCell>
    </TableRow>
  );
};
