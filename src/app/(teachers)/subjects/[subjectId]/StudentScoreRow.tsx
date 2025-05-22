"use client";
import { useWatch } from "react-hook-form";
import { ScoreInput } from "@/components/ScoreInput";

interface Props {
  student: any;
  gradingComponents: { name: string; weight: number }[];
  register: any;
  errors: any;
  control: any;
}

export const StudentScoreRow = ({
  student,
  gradingComponents,
  register,
  errors,
  control,
}: Props) => {
  const watchedValues = useWatch({ control });

  const total = gradingComponents.reduce((sum, comp) => {
    const val = watchedValues?.[student.user_id]?.[comp.name] ?? 0;
    const num = Number(val) || 0;
    return sum + (num > comp.weight ? comp.weight : num);
  }, 0);

  return (
    <tr className="border-t">
      <td className="p-3">{student.first_name}</td>
      <td className="p-3">{student.last_name}</td>
      {gradingComponents.map((comp) => (
        <td key={comp.name} className="p-3">
          <ScoreInput
            name={`${student.user_id}.${comp.name}`}
            register={register}
            error={errors?.[student.user_id]?.[comp.name]}
            max={comp.weight}
          />
        </td>
      ))}
      <td className="p-3 font-semibold">{total}</td>
    </tr>
  );
};
