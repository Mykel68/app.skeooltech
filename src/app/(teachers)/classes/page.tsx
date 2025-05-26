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
  SelectValue,
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
import { Trash2, Pencil, MoreVertical, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Schema & Types
const subjectSchema = z.object({
  class_id: z.string().min(1, "Class is required"),
  name: z.string().min(2, "Subject name is required"),
  short: z.string().min(1, "Subject code is required"),
});
type SubjectFormValues = z.infer<typeof subjectSchema>;

type SchoolClass = {
  class_id: string;
  name: string;
  grade_level: string;
};

type Subject = {
  subject_id: string;
  name: string;
  short: string;
  class_id: string;
  class_name: string;
  grade_level: string;
  teacher_name: string;
  teacher_email: string;
  is_approved: boolean;
};

// API Functions
const fetchClasses = async (schoolId: string): Promise<SchoolClass[]> => {
  const { data } = await axios.get(`/api/class/get-all-class/${schoolId}`);
  return data.data.classes;
};

const fetchSubjects = async (
  schoolId: string,
  userId: string
): Promise<Subject[]> => {
  const { data } = await axios.get(`/api/subject/by-teacher/${userId}`);
  return data.data;
};

const createSubject = async (
  payload: SubjectFormValues & { schoolId: string }
) => {
  await axios.post(`/api/subject/create-new/${payload.class_id}`, {
    name: payload.name,
    short: payload.short,
  });
};

const updateSubject = async (
  payload: SubjectFormValues & { subject_id: string }
) => {
  await axios.patch(`/api/subject/update/${payload.subject_id}`, {
    name: payload.name,
    short: payload.short,
    class_id: payload.class_id,
  });
};

const deleteSubject = async (subject_id: string) => {
  await axios.delete(`/api/subject/delete/${subject_id}`);
};

// Main Component
export default function SubjectTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const userId = useUserStore((s) => s.userId)!;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSubject, setSettingsSubject] = useState<Subject | null>(null);

  const { data: classes = [] } = useQuery({
    queryKey: ["classes", schoolId],
    queryFn: () => fetchClasses(schoolId),
    enabled: !!schoolId,
  });

  const { data: subjects = [] } = useQuery({
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
      setOpen(false);
      reset();
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to create subject"),
  });

  const updateMutation = useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      toast.success("Subject updated!");
      queryClient.invalidateQueries({
        queryKey: ["subjects", schoolId, userId],
      });
      setOpen(false);
      reset();
      setEditMode(false);
      setEditingSubject(null);
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Failed to update subject"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      toast.success("Subject deleted");
      queryClient.invalidateQueries({
        queryKey: ["subjects", schoolId, userId],
      });
    },
    onError: () => toast.error("Failed to delete subject"),
  });

  const onSubmit = (values: SubjectFormValues) => {
    if (editMode && editingSubject) {
      updateMutation.mutate({
        ...values,
        subject_id: editingSubject.subject_id,
      });
    } else {
      createMutation.mutate({ ...values, schoolId });
    }
  };

  const handleEdit = (subject: Subject) => {
    setValue("name", subject.name);
    setValue("short", subject.short);
    setValue("class_id", subject.class_id);
    setEditingSubject(subject);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <div className="p-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Subjects</CardTitle>
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (!val) {
                reset();
                setEditMode(false);
                setEditingSubject(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>{editMode ? "Edit Subject" : "Create Subject"}</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? "Edit Subject" : "Create Subject"}
                  </DialogTitle>
                </DialogHeader>
                <Select
                  onValueChange={(value) => setValue("class_id", value)}
                  defaultValue={editingSubject?.class_id}
                >
                  <SelectTrigger className="w-full" disabled={!classes.length}>
                    <SelectValue placeholder="Select Class" />
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
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {editMode ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {/* Settings Dialog */}
          <Dialog
            open={settingsOpen}
            onOpenChange={(val) => {
              setSettingsOpen(val);
              if (!val) setSettingsSubject(null);
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Settings for {settingsSubject?.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Settings options coming soon…
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSettingsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((s) => (
                <TableRow key={s.subject_id} className="cursor-pointer">
                  <TableCell
                    onClick={() => {
                      router.push(
                        `/classes/${
                          s.class_id
                        }?subjectName=${encodeURIComponent(s.name)}`
                      );
                    }}
                  >
                    {s.class_name}
                  </TableCell>
                  <TableCell>{s.grade_level}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>
                    <Badge variant={s.is_approved ? "default" : "secondary"}>
                      {s.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* Action menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(s)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSettingsOpen(true);
                            setSettingsSubject(s);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-2" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(s.subject_id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
