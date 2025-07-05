import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const addChildSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .max(20, "Student ID too long"),
  linkingCode: z
    .string()
    .min(6, "Linking code must be at least 6 characters")
    .max(10, "Linking code too long"),
});

type AddChildForm = z.infer<typeof addChildSchema>;

interface AddChildDialogProps {
  open: boolean;
  onClose: () => void;
  onChildAdded: () => void;
}

// Mock API function
const mockAddChild = async (data: {
  studentId?: string;
  linkingCode?: string;
}): Promise<{ student: { name: string; grade: string; id: string } }> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  if (data.studentId === "404" || data.linkingCode === "INVALID") {
    throw new Error("Student not found or invalid code");
  }

  return {
    student: {
      name: data.studentId ? `Student ${data.studentId}` : "Jane Smith",
      grade: "Grade 6",
      id: data.studentId || `STU${Date.now()}`,
    },
  };
};

const AddChildDialog = ({
  open,
  onClose,
  onChildAdded,
}: AddChildDialogProps) => {
  const form = useForm<AddChildForm>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      studentId: "",
      linkingCode: "",
    },
  });

  const addChildMutation = useMutation({
    mutationFn: mockAddChild,
    onSuccess: (data) => {
      // Add to existing children
      const existing = JSON.parse(
        localStorage.getItem("linkedChildren") || "[]"
      );
      const updated = [...existing, data.student];
      localStorage.setItem("linkedChildren", JSON.stringify(updated));

      form.reset();
      onChildAdded();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: AddChildForm) => {
    const method = form.watch("studentId") ? "id" : "code";
    if (method === "id") {
      addChildMutation.mutate({ studentId: data.studentId });
    } else {
      addChildMutation.mutate({ linkingCode: data.linkingCode });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Another Child</DialogTitle>
          <DialogDescription>
            Link another child's account to monitor their progress
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="id" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="id">Student ID</TabsTrigger>
            <TabsTrigger value="code">Linking Code</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="id" className="space-y-4">
                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter student ID"
                          {...field}
                          className="text-center font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkingCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linking Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter 6-digit code"
                          {...field}
                          className="text-center font-mono tracking-wider"
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addChildMutation.isPending}>
                  {addChildMutation.isPending ? "Adding..." : "Add Child"}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildDialog;
