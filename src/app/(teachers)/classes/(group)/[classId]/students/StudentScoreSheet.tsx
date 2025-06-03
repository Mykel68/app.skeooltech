"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface Component {
  name: string;
  weight: number;
}

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  scores: { component_name: string; score: number }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  components: Component[];
  updateScores: (data: Record<string, number>) => void;
}

export const StudentScoreSheet = ({
  isOpen,
  onClose,
  student,
  components,
  updateScores,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, number>>();

  useEffect(() => {
    if (student?.scores) {
      const defaultValues: Record<string, number> = {};
      student.scores.forEach((s) => {
        defaultValues[s.component_name] = s.score;
      });
      reset(defaultValues);
    }
  }, [student, reset]);

  const handleSave = (data: Record<string, number>) => {
    updateScores(data);
    onClose();
  };

  if (!student) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[480px] p-4">
        <SheetHeader>
          <SheetTitle>
            Edit Scores for {student.first_name} {student.last_name}
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(handleSave)} className="mt-6 space-y-4">
          {components.map((comp) => (
            <div key={comp.name}>
              <Label htmlFor={comp.name} className="text-sm font-medium">
                {comp.name} (max {comp.weight})
              </Label>
              <Input
                id={comp.name}
                type="number"
                min={0}
                max={comp.weight}
                step="any"
                {...register(comp.name, {
                  valueAsNumber: true,
                  min: { value: 0, message: "Too low" },
                  max: { value: comp.weight, message: `Max is ${comp.weight}` },
                })}
              />
              {errors[comp.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[comp.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full mt-6">
            Save Scores
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
