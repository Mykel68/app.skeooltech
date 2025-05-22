"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { StudentScoreRow } from "./StudentScoreRow";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

interface GradingComponent {
  name: string;
  weight: number;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  scores?: { component_name: string; score: number }[];
}

interface Props {
  students: Student[];
  gradingComponents: GradingComponent[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control: Control<any>;
  onStudentClick?: (student: Student) => void;
}

export const GradingTable = ({
  students,
  gradingComponents,
  register,
  errors,
  control,
  onStudentClick,
}: Props) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            {gradingComponents.map((comp) => (
              <TableCell key={comp.name}>{comp.name}</TableCell>
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
  );
};
