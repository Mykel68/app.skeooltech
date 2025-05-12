"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Zod schema for subject
const subjectSchema = z.object({
  name: z.string().min(2, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
});

type SubjectForm = z.infer<typeof subjectSchema>;

export function ClassCard({
  id: classId,
  name,
  grade_level,
}: {
  id: string;
  name: string;
  grade_level: string;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
  });

  const createSubject = useMutation({
    mutationFn: (data: SubjectForm) =>
      axios.post(`/api/subject/create/${classId}`, data),
    onSuccess: () => {
      toast.success("Subject created");
      queryClient.invalidateQueries(["subjects", classId]);
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create subject");
    },
  });

  const onSubmit = (data: SubjectForm) => createSubject.mutate(data);

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-2">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{grade_level}</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">Create Subject</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Subject for {name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Subject Name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}

            <Input placeholder="Subject Code" {...register("code")} />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code.message}</p>
            )}

            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createSubject.isPending}
              >
                {createSubject.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
