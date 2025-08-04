"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Trash2,
  PlusCircle,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";

const ComponentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s-]+$/, "Only letters, spaces, and dashes allowed"),
  weight: z
    .number({ invalid_type_error: "Must be a number" })
    .min(1, "Min 1%")
    .max(100, "Max 100%"),
});

const FormSchema = z.object({
  components: z.array(ComponentSchema).min(1, "Add at least one component"),
});

type FormType = z.infer<typeof FormSchema>;

interface AssessmentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  gradeLevel: string;
  classId: string;
  subjectId: string;
}

export const AssessmentSettingsDialog: React.FC<
  AssessmentSettingsDialogProps
> = ({ open, onOpenChange, subjectName, gradeLevel, classId, subjectId }) => {
  const schoolId = useUserStore((s) => s.schoolId)!;

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
    queryKey: ["grade_components", schoolId, classId, subjectId],
    queryFn: async () => {
      const res = await axios.get(
        `/api/grade_setting/get-grade-setting/${schoolId}/${classId}/${subjectId}`
      );
      return res.data.data.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: open,
  });

  useEffect(() => {
    console.log("subjectId", subjectId);
    if (data?.components) {
      reset({ components: data.components });
    }
  }, [data, reset, subjectId]);

  const mutation = useMutation({
    mutationFn: async (components: FormType["components"]) => {
      const isUpdate = Boolean(data?.components && data.components.length > 0);
      const endpoint = isUpdate
        ? `/api/grade_setting/edit-class-grade-setting/${schoolId}/${classId}/${subjectId}`
        : `/api/grade_setting/${schoolId}/${classId}/${subjectId}`;
      const method = isUpdate ? "put" : "post";
      const res = await axios[method](endpoint, { components });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assessment settings saved successfully!");
      onOpenChange(false);
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

  const getWeightColor = () => {
    if (totalWeight < 100) return "text-amber-600";
    if (totalWeight > 100) return "text-red-500";
    return "text-emerald-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6" />
              <DialogTitle className="text-xl">
                Assessment Setup - {subjectName} ({gradeLevel})
              </DialogTitle>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/20 border border-white/30">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                {totalWeight === 100 && <CheckCircle2 className="w-4 h-4" />}
                {totalWeight !== 100 && <AlertCircle className="w-4 h-4" />}
                {totalWeight}%
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-200 border-t-green-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  Loading settings...
                </span>
              </div>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="group bg-gray-50 hover:bg-gray-100/80 rounded-lg p-4 border transition-all duration-200"
              >
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">
                      {index + 1}
                    </div>
                  </div>

                  <div className="col-span-5 space-y-1">
                    <Label
                      htmlFor={`name-${index}`}
                      className="text-xs font-medium text-gray-700"
                    >
                      Component Name
                    </Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="e.g., Final Exam"
                      {...register(`components.${index}.name`)}
                      className="h-9 text-sm"
                    />
                    {errors.components?.[index]?.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.components[index].name?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-4 space-y-1">
                    <Label
                      htmlFor={`weight-${index}`}
                      className="text-xs font-medium text-gray-700"
                    >
                      Weight (%)
                    </Label>
                    <div className="relative">
                      <Input
                        id={`weight-${index}`}
                        placeholder="40"
                        {...register(`components.${index}.weight`, {
                          valueAsNumber: true,
                        })}
                        className="h-9 text-sm pr-6"
                      />
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                        %
                      </span>
                    </div>
                    {errors.components?.[index]?.weight && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.components[index].weight?.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="w-8 h-8 p-0 rounded-full bg-red-50 hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", weight: 0 })}
              className="gap-2 h-9 text-sm border-dashed border-emerald-200 text-emerald-600 hover:bg-indigo-50"
            >
              <PlusCircle size={16} />
              Add Component
            </Button>

            <div
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                totalWeight === 100
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : totalWeight > 100
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
              }`}
            >
              Total: <span className={getWeightColor()}>{totalWeight}%</span>
              {totalWeight === 100 && " ✓"}
            </div>
          </div>

          {totalWeight !== 100 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-3 h-3" />
                {totalWeight < 100
                  ? `Need ${100 - totalWeight}% more to reach 100%`
                  : `${totalWeight - 100}% over limit`}
              </p>
            </div>
          )}
        </div>

        <Separator />

        <DialogFooter>
          <div className="grid grid-cols-2 justify-items-center ">
            <Link
              href={`/classes/settings?class=${classId}&subjectName=${encodeURIComponent(
                subjectName
              )}&gradeLevel=${encodeURIComponent(gradeLevel || "")}`}
              className="text-sm flex items-center justify-center"
            >
              <p>See settings page</p>
            </Link>
            <div className="space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={totalWeight > 100 || mutation.isPending}
                className={`h-9 gap-2 ${
                  totalWeight <= 100 && !mutation.isPending
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    : ""
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
