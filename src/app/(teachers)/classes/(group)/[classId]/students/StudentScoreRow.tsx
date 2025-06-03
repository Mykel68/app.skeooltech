"use client";

import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";

// Exactly the same normalization logic as SubjectStudentsClient
const normalizeKey = (key: string) => key.replace(/\s+/g, "_");

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
  // Watch the entire student’s object by their user_id:
  const watchedValues = useWatch({
    control,
    name: student.user_id, // no “students.” prefix! Must match defaultValues’ keys.
  });

  console.log("watchedValues:", watchedValues); // for debugging

  // Calculate total from whatever is currently in watchedValues:
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
        // Register at `${userId}.${lowercase_underscore_key}`
        const fieldName = `${student.user_id}.${key}`;
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
