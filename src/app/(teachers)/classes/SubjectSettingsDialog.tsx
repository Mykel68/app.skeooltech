import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Subject } from "./SubjectForm";

interface SubjectSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
}

export const SubjectSettingsDialog: React.FC<SubjectSettingsDialogProps> = ({
  open,
  onOpenChange,
  subject,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Settings for {subject?.name}</DialogTitle>
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
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
