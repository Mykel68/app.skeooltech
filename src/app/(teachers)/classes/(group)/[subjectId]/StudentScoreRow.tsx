"use client";

import { useWatch } from "react-hook-form";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

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
  const watchedValues = useWatch({
    control,
    name: `students.${student.user_id}`,
  });

  const total = gradingComponents.reduce((sum, comp) => {
    const key = normalizeKey(comp.name);
    const val = watchedValues?.[key];
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
        const key = normalizeKey(comp.name);
        const fieldName = `students.${student.user_id}.${key}`;
        const error = errors?.students?.[student.user_id]?.[key];

        return (
          <TableCell key={comp.name}>
            <div className="flex flex-col">
              <Input
                type="number"
                min={0}
                max={comp.weight}
                className={error ? "border-red-500" : ""}
                {...register(fieldName, {
                  valueAsNumber: true,
                  min: { value: 0, message: "Too low" },
                  max: { value: comp.weight, message: `Max is ${comp.weight}` },
                })}
              />
              {error && (
                <span className="text-xs text-red-500 mt-1">
                  {error.message}
                </span>
              )}
            </div>
          </TableCell>
        );
      })}

      <TableCell className="font-semibold">{total}</TableCell>
    </TableRow>
  );
};
