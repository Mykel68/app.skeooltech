"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Zod schema
const subjectSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  name: z.string().min(2, "Subject name is required"),
  short: z.string().min(1, "Subject code is required"),
});
type SubjectFormValues = z.infer<typeof subjectSchema>;

// Types
type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

type Subject = {
  subject_id: string;
  name: string;
  class_id: string;
  class_name: string;
  grade_level: string;
  teacher_name: string;
  teacher_email: string;
  is_approved: boolean;
};

// Fetchers
async function fetchClasses(schoolId: string): Promise<SchoolClass[]> {
  const { data } = await axios.get(`/api/class/get-all-class/${schoolId}`);
  return data.data.classes;
}

async function fetchSubjects(
  schoolId: string,
  userId: string
): Promise<Subject[]> {
  const { data } = await axios.get(`/api/subject/by-teacher/${userId}`);
  console.log("subjects", data.data);
  return data.data;
}

async function createSubject(
  payload: SubjectFormValues & { schoolId: string }
) {
  await axios.post(`/api/subject/create-new/${payload.class_id}`, {
    name: payload.name,
    short: payload.short,
  });
}

export default function SubjectTable() {
  const router = useRouter();
  const schoolId = useUserStore((s) => s.schoolId)!;
  const userId = useUserStore((s) => s.userId)!;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: classes = [], isPending: loadingClasses } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId),
    enabled: !!schoolId,
  });

  const { data: subjects = [], isPending: loadingSubjects } = useQuery({
    queryKey: ["subjects", schoolId, userId],
    queryFn: () => fetchSubjects(schoolId, userId),
    enabled: !!schoolId && !!userId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast.success("Subject created!");
      queryClient.invalidateQueries({
        queryKey: ["subjects", schoolId, userId],
      });
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create subject");
    },
  });

  const onSubmit = (values: SubjectFormValues) => {
    createMutation.mutate({ ...values, schoolId });
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Classes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create New Subject</DialogTitle>
              </DialogHeader>

              <Select onValueChange={(value) => setValue("class_id", value)}>
                <SelectTrigger className="w-full">
                  <span>Select class</span>
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.class_id} value={c.class_id}>
                      {c.name} ({c.grade_level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.class_id && (
                <p className="text-sm text-red-500">
                  {errors.class_id.message}
                </p>
              )}

              <Input placeholder="Subject Name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <Input placeholder="Subject Code" {...register("short")} />
              {errors.short && (
                <p className="text-sm text-red-500">{errors.short.message}</p>
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
                  disabled={isSubmitting || createMutation.isPending}
                >
                  {isSubmitting || createMutation.isPending
                    ? "Creating..."
                    : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingSubjects ? (
        <p>Loading subjects…</p>
      ) : subjects.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Subject Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subj) => (
              <TableRow
                key={subj.subject_id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => router.push(`/subjects/${subj.class_id}`)}
              >
                <TableCell>{subj.class_name}</TableCell>
                <TableCell>{subj.grade_level}</TableCell>
                <TableCell>{subj.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={subj.is_approved ? "default" : "secondary"}
                    className={
                      subj.is_approved
                        ? "bg-green-600 text-white"
                        : "bg-red-300 text-black"
                    }
                  >
                    {subj.is_approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No subjects found.</p>
      )}
    </div>
  );
}
