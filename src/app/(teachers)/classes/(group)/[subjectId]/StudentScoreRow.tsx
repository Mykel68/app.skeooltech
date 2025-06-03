"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";

const normalizeKey = (key: string) => key.toLowerCase().replace(/\s+/g, "_");

export const StudentScoreRow = ({
  student,
  gradingComponents,
  register,
  errors,
  control,
  onClick,
}: {
  student: any;
  gradingComponents: { name: string; weight: number }[];
  register: any;
  errors: any;
  control: any;
  onClick?: (student: any) => void;
}) => {
  // Watch only this student’s slice of the form:
  const watchedValues = useWatch({
    control,
    name: `students.${student.user_id}`,
  });

  // Compute total based on whatever is currently typed:
  const total = gradingComponents.reduce((sum, comp) => {
    const key = normalizeKey(comp.name);
    const val = watchedValues?.[key];
    const num = typeof val === "number" ? val : parseFloat(val) || 0;
    return sum + Math.min(num, comp.weight);
  }, 0);

  return (
    <TableRow>
      <TableCell onClick={() => onClick?.(student)}>
        {student.first_name}
      </TableCell>
      <TableCell onClick={() => onClick?.(student)}>
        {student.last_name}
      </TableCell>

      {gradingComponents.map((comp, index) => {
        const key = normalizeKey(comp.name);
        const fieldName = `students.${student.user_id}.${key}`;
        const error = errors?.[student.user_id]?.[key];

        return (
          <TableCell key={index}>
            <Input
              type="number"
              min={0}
              max={comp.weight}
              {...register(fieldName, {
                valueAsNumber: true,
                min: { value: 0, message: "Too low" },
                max: { value: comp.weight, message: "Too high" },
              })}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error.message}</p>
            )}
          </TableCell>
        );
      })}

      <TableCell className="font-semibold">{total.toFixed(1)}</TableCell>
    </TableRow>
  );
};
