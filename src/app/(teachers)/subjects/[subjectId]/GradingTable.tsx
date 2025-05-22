"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { StudentScoreRow } from "./StudentScoreRow";

interface Props {
  students: any[];
  gradingComponents: { name: string; weight: number }[];
  register: any;
  errors: any;
  control: any;
}

export const GradingTable = ({
  students,
  gradingComponents,
  register,
  errors,
  control,
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
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
