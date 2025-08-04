"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SubjectTableLoadingState } from "./LoadingStates";
import { SubjectEmptyState } from "./EmptyState";
import { SubjectErrorState } from "./ErrorState";
import { SubjectForm, SubjectFormValues, Subject } from "./SubjectForm";
import { AssessmentSettingsDialog } from "./SubjectSettingsDialog";
import { SubjectTableRow } from "./SubjectTableRows";
import { useSubjects } from "./useSubjects";

export default function SubjectTable() {
  const schoolId = useUserStore((s) => s.schoolId)!;
  const userId = useUserStore((s) => s.userId)!;
  const termId = useUserStore((s) => s.term_id)!;
  const sessionId = useUserStore((s) => s.session_id)!;

  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSubject, setSettingsSubject] = useState<Subject | null>(null);

  const handleFormClose = () => {
    setFormOpen(false);
    setEditMode(false);
    setEditingSubject(null);
  };

  const {
    classesQuery,
    subjectsQuery,
    createSubjectMutation,
    updateSubjectMutation,
    deleteSubjectMutation,
  } = useSubjects({
    schoolId,
    userId,
    sessionId,
    termId,
    onFormClose: handleFormClose,
  });

  const handleFormSubmit = (values: SubjectFormValues) => {
    if (editMode && editingSubject) {
      updateSubjectMutation.mutate({
        ...values,
        schoolId,
        subject_id: editingSubject.subject_id,
      });
    } else {
      createSubjectMutation.mutate({
        ...values,
        schoolId,
        sessionId,
        termId,
      });
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setEditMode(true);
    setFormOpen(true);
  };

  const handleSettings = (subject: Subject) => {
    setSettingsSubject(subject);
    setSettingsOpen(true);
  };

  const handleDelete = (subjectId: string) => {
    deleteSubjectMutation.mutate({ subject_id: subjectId, schoolId });
  };

  const handleCreateClick = () => {
    setFormOpen(true);
  };

  const handleRetry = () => {
    subjectsQuery.refetch();
  };

  if (subjectsQuery.isLoading || classesQuery.isLoading) {
    return (
      <div className="p-4">
        <Card className="w-full">
          <CardContent className="p-6">
            <SubjectTableLoadingState />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (subjectsQuery.error || classesQuery.error) {
    return (
      <div className="p-4">
        <Card className="w-full">
          <CardContent className="p-6">
            <SubjectErrorState onRetry={handleRetry} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Subjects</CardTitle>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Subject
          </Button>
        </CardHeader>

        <CardContent>
          <SubjectForm
            open={formOpen}
            onOpenChange={setFormOpen}
            editMode={editMode}
            editingSubject={editingSubject}
            classes={classesQuery.data || []}
            onSubmit={handleFormSubmit}
            isSubmitting={
              createSubjectMutation.isPending || updateSubjectMutation.isPending
            }
          />

          <AssessmentSettingsDialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
            classId={settingsSubject?.class_id || ""}
            subjectName={settingsSubject?.name || ""}
            gradeLevel={settingsSubject?.grade_level || ""}
            subjectId={settingsSubject?.subject_id! || ""}
          />

          {subjectsQuery.data?.length === 0 ? (
            <SubjectEmptyState onCreateClick={handleCreateClick} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade Level</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectsQuery.data?.map((subject) => (
                  <SubjectTableRow
                    key={subject.subject_id}
                    subject={subject}
                    onEdit={handleEdit}
                    onSettings={handleSettings}
                    onDelete={handleDelete}
                    isDeleting={deleteSubjectMutation.isPending}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
