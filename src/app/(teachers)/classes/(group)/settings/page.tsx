"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Trash2,
  PlusCircle,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const schoolId = useUserStore((s) => s.schoolId)!;
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subjectName");
  const class_id = searchParams.get("class");
  const gradeLevel = searchParams.get("gradeLevel");

  const {
    control,
    register,
    handleSubmit,
    reset,
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

  const { data, isLoading } = useQuery({
    queryKey: ["grade_components", schoolId, class_id],
    queryFn: async () => {
      const res = await axios.get(
        `/api/grade_setting/get-grade-setting/${schoolId}/${class_id}`
      );
      return res.data.data.data; // return full grading setting object
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.components) {
      reset({ components: data.components });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (components: FormType["components"]) => {
      const isUpdate = Boolean(data?.components && data.components.length > 0);

      const endpoint = isUpdate
        ? `/api/grade_setting/edit-grade-setting/${schoolId}/${class_id}`
        : `/api/grade_setting/${schoolId}/${class_id}`;

      const method = isUpdate ? "put" : "post";

      const res = await axios[method](endpoint, { components });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assessment settings saved successfully!");
      router.back();
    },
    onError: () => {
      toast.error("Failed to save assessment settings.");
    },
  });

  const onSubmit = (formData: FormType) => {
    if (totalWeight > 100) {
      toast.error("Total weight exceeds 100%");
      return;
    }

    mutation.mutate(formData.components);
  };

  const getWeightStatusColor = () => {
    if (totalWeight < 100) return "text-amber-600";
    if (totalWeight > 100) return "text-red-500";
    return "text-emerald-600";
  };

  const getWeightStatusBg = () => {
    if (totalWeight < 100) return "bg-amber-50 border-amber-200";
    if (totalWeight > 100) return "bg-red-50 border-red-200";
    return "bg-emerald-50 border-emerald-200";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="w-full mx-auto pt-4">
        {/* Enhanced Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 mb-4">
            <BookOpen className="w-5 h-5 text-green-700" />
            <span className="text-sm font-medium text-green-700">
              Assessment Configuration
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
            Assessment Setup
          </h1>
          <p className="text-gray-600 text-lg">
            Configure grading components for{" "}
            <span className="font-semibold text-green-600">
              {subjectName} - {gradeLevel}
            </span>
          </p>
        </div> */}

        <Card className="  backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Grading Components</h2>
              </div>
              <div
                className={`px-4 py-2 rounded-full border-2 border-white/30 bg-white/20`}
              >
                <span className="text-white font-bold flex items-center gap-2">
                  {totalWeight === 100 && <CheckCircle2 className="w-4 h-4" />}
                  {totalWeight !== 100 && <AlertCircle className="w-4 h-4" />}
                  {totalWeight}% / 100%
                </span>
              </div>
            </div>
            <p className="text-indigo-100 mt-2">
              Define grading components like Exam, Test, Assignment, etc.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-green-600 rounded-full animate-spin"></div>
                  <p className="text-gray-600">Loading existing settings...</p>
                </div>
              </div>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group bg-gray-50/80 hover:bg-white/80 rounded-2xl p-6 border border-gray-200/50 hover:border-indigo-200/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 gap-y-4 items-end">
                    {/* Component Number */}
                    <div className="sm:col-span-1 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>

                    <div className="sm:col-span-5 space-y-2">
                      <Label
                        htmlFor={`name-${index}`}
                        className="font-semibold text-gray-700"
                      >
                        Component Name
                      </Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="e.g., Final Exam, Quiz, Assignment"
                        {...register(`components.${index}.name`)}
                        className="border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      />
                      {errors.components?.[index]?.name && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.components[index].name?.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-4 space-y-2">
                      <Label
                        htmlFor={`weight-${index}`}
                        className="font-semibold text-gray-700"
                      >
                        Weight (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id={`weight-${index}`}
                          placeholder="e.g., 40"
                          {...register(`components.${index}.weight`, {
                            valueAsNumber: true,
                          })}
                          className="border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/80 pr-8"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </span>
                      </div>
                      {errors.components?.[index]?.weight && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.components[index].weight?.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2 flex justify-end items-center">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", weight: 0 })}
                className="gap-2 px-6 py-3 border-2 border-dashed border-emerald-400 hover:border-emerald-400 text-emerald-600 hover:text-emerald-700 hover:bg-indigo-50/50 transition-all duration-200 rounded-xl"
              >
                <PlusCircle size={18} />
                Add Component
              </Button>

              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${getWeightStatusBg()}`}
              >
                {totalWeight === 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                )}
                <p className="text-sm font-semibold">
                  Total:{" "}
                  <span className={`text-lg ${getWeightStatusColor()}`}>
                    {totalWeight}%
                  </span>
                </p>
                {totalWeight === 100 && (
                  <span className="text-emerald-600 text-sm">✓ Perfect!</span>
                )}
              </div>
            </div>

            {/* Validation Messages */}
            {totalWeight !== 100 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {totalWeight < 100
                    ? `You need ${100 - totalWeight}% more to reach 100%`
                    : `You're ${
                        totalWeight - 100
                      }% over the limit. Please adjust the weights.`}
                </p>
              </div>
            )}
          </CardContent>

          <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <CardFooter className="justify-end p-8 bg-gray-50/30">
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={totalWeight > 100 || mutation.isPending}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                totalWeight <= 100 && !mutation.isPending
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : ""
              }`}
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Tips Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm">
              💡
            </span>
            Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>• Ensure all weights add up to exactly 100%</div>
            <div>• Consider the importance of each component</div>
            <div>• Major exams typically carry 30-50% weight</div>
            <div>• Participation usually ranges from 5-15%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
