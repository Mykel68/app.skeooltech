"use client";

import { useWatch } from "react-hook-form";
import { ScoreInput } from "@/components/ScoreInput";
import { TableRow, TableCell } from "@/components/ui/table"; // adjust path as per your project structure

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
  const watchedValues = useWatch({ control });

  const total = gradingComponents.reduce((sum, comp) => {
    const val = watchedValues?.[student.user_id]?.[comp.name] ?? 0;
    const num = Number(val) || 0;
    return sum + (num > comp.weight ? comp.weight : num);
  }, 0);

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted"
      onClick={() => onClick && onClick(student)}
      tabIndex={0}
      role="button"
      aria-pressed="false"
    >
      <TableCell>{student.first_name}</TableCell>
      <TableCell>{student.last_name}</TableCell>
      {gradingComponents.map((comp) => (
        <TableCell key={comp.name}>
          <ScoreInput
            name={`${student.user_id}.${comp.name}`}
            register={register}
            error={errors?.[student.user_id]?.[comp.name]}
            max={comp.weight}
          />
        </TableCell>
      ))}
      <TableCell className="font-semibold">{total}</TableCell>
    </TableRow>
  );
};
