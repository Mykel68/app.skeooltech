"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, PlusCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { useSearchParams } from "next/navigation";

const ComponentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  weight: z
    .number({ invalid_type_error: "Must be a number" })
    .min(1, "Min 1%")
    .max(100, "Max 100%"),
});

const FormSchema = z.object({
  components: z.array(ComponentSchema).min(1, "Add at least one component"),
});

type FormType = z.infer<typeof FormSchema>;

export default function AssessmentSettings() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  // const classId = "some_class_id"; // Replace or derive dynamically
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName");
  const class_id = searchParams.get("class");
  const gradeLevel = searchParams.get("gradeLevel");

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      components: [{ name: "", weight: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  const components = watch("components");
  const totalWeight = components.reduce((sum, c) => sum + (c.weight || 0), 0);

  const mutation = useMutation({
    mutationFn: async (data: FormType["components"]) => {
      console.log("data component", data);
      const res = await axios.post(
        `/api/grade_setting/${schoolId}/${class_id}`,
        { components: data }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assessment saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save assessment.");
    },
  });

  const onSubmit = (data: FormType) => {
    if (totalWeight > 100) {
      toast.error("Total weight exceeds 100%");
      return;
    }

    mutation.mutate(data.components);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <Card className="shadow-xl border-none w-full">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Assessment Setup for {subjectName} - {gradeLevel}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Define grading components like Exam, Test, Assignment, etc.
          </p>
        </CardHeader>

        <CardContent className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-4 gap-y-2 items-end p-4 rounded-xl"
            >
              <div className="sm:col-span-5 space-y-2">
                <Label htmlFor={`name-${index}`}>Name</Label>
                <Input
                  id={`name-${index}`}
                  placeholder="e.g., Exam"
                  {...register(`components.${index}.name`)}
                />
                {errors.components?.[index]?.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.components[index].name?.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-5 space-y-2">
                <Label htmlFor={`weight-${index}`}>Amount (%)</Label>
                <Input
                  id={`weight-${index}`}
                  placeholder="e.g., 40"
                  {...register(`components.${index}.weight`, {
                    valueAsNumber: true,
                  })}
                />
                {errors.components?.[index]?.weight && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.components[index].weight?.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 flex justify-end">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="mt-6"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", weight: 0 })}
              className="gap-1"
            >
              <PlusCircle size={18} />
              Add Component
            </Button>

            <p className="text-sm text-muted-foreground">
              Total:{" "}
              <span
                className={
                  totalWeight > 100
                    ? "text-red-500 font-semibold"
                    : "font-medium"
                }
              >
                {totalWeight}%
              </span>
            </p>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="justify-end">
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={totalWeight > 100 || mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
