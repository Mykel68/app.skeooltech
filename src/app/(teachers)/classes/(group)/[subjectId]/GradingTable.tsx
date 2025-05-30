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
          {students.map((student) => (
            <>
              <p>{student.user_id}</p>
              <p>{student.first_name}</p>
              <p>{student.last_name}</p>
              {/* <p>{student.scores}</p> */}
              {/* <p>{student.scores?.length}</p> */}
              <p>{student.scores?.map((s) => s.score)}</p>
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
