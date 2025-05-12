"use client";

import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp } from "lucide-react";

const subjectSchema = z.object({
  name: z.string().min(2, "Subject name is required"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

type Subject = {
  id: string;
  name: string;
  grade_level: string;
};

async function fetchSubject(schoolId: string): Promise<Subject[]> {
  const { data } = await axios.get(`/api/class/get-all-classs/${schoolId}`);
  return data.data.classes;
}

async function createSubject({
  name,
  schoolId,
}: SubjectFormValues & { schoolId: string }) {
  await axios.post(`/api/class/create-new/${schoolId}`, { name, grade_level });
}

export default function SubjectTable() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [sortKey, setSortKey] = useState<"name" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const schoolId = useUserStore((s) => s.schoolId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  const { data: classes, isLoading } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchSubject(schoolId!),
    enabled: !!schoolId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast.success("Class created successfully");
      queryClient.invalidateQueries({ queryKey: ["classes", schoolId] });
      reset();
      setOpen(false);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || "Failed to create class";
      toast.error(message);
    },
  });

  const onSubmit = (values: SubjectFormValues) => {
    if (!schoolId) return;
    mutate({ ...values, schoolId });
  };

  const toggleSort = (key: "name" | "grade_level") => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedClasses = useMemo(() => {
    if (!classes) return [];
    if (!sortKey) return classes;

    return [...classes].sort((a, b) => {
      const aValue = a[sortKey].toLowerCase();
      const bValue = b[sortKey].toLowerCase();
      const direction = sortDirection === "asc" ? 1 : -1;
      return aValue.localeCompare(bValue) * direction;
    });
  }, [classes, sortKey, sortDirection]);

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Classes</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create New Class</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create a Class</DialogTitle>
              </DialogHeader>
              <Input placeholder="Enter class name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <Input
                placeholder="Enter grade level (e.g. JSS2A)"
                {...register("grade_level")}
              />
              {errors.grade_level && (
                <p className="text-sm text-red-500">
                  {errors.grade_level.message}
                </p>
              )}

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading classes...</p>
      ) : sortedClasses?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Name{" "}
                {sortKey === "name" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("grade_level")}
              >
                Grade Level{" "}
                {sortKey === "grade_level" &&
                  (sortDirection === "asc" ? (
                    <ArrowUp className="inline h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4" />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClasses.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.grade_level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No classes available.</p>
      )}
    </div>
  );
}
