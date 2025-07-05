import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";

const linkChildSchema = z.object({
  studentId: z
    .string()
    .min(1, "Student ID is required")
    .max(20, "Student ID too long"),
  linkingCode: z
    .string()
    .min(6, "Linking code must be at least 6 characters")
    .max(10, "Linking code too long"),
});

type LinkChildForm = z.infer<typeof linkChildSchema>;

interface LinkChildPageProps {
  onChildLinked: () => void;
}

// Mock API function
const mockLinkChild = async (data: {
  studentId?: string;
  linkingCode?: string;
}): Promise<{ student: { name: string; grade: string; id: string } }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate validation
  if (data.studentId === "404" || data.linkingCode === "INVALID") {
    throw new Error("Student not found or invalid code");
  }

  return {
    student: {
      name: data.studentId ? `Student ${data.studentId}` : "John Doe",
      grade: "Grade 8",
      id: data.studentId || "STU001",
    },
  };
};

const LinkChildPage = ({ onChildLinked }: LinkChildPageProps) => {
  const [linkMethod, setLinkMethod] = useState<"id" | "code">("id");

  const form = useForm<LinkChildForm>({
    resolver: zodResolver(linkChildSchema),
    defaultValues: {
      studentId: "",
      linkingCode: "",
    },
  });

  const linkChildMutation = useMutation({
    mutationFn: mockLinkChild,
    onSuccess: (data) => {
      localStorage.setItem("parentHasChildren", "true");
      localStorage.setItem("parentFirstLogin", "false");
      localStorage.setItem("linkedChildren", JSON.stringify([data.student]));

      toast.success(
        `${data.student.name} from ${data.student.grade} has been added to your account.`
      );

      setTimeout(() => {
        onChildLinked();
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: LinkChildForm) => {
    if (linkMethod === "id") {
      linkChildMutation.mutate({ studentId: data.studentId });
    } else {
      linkChildMutation.mutate({ linkingCode: data.linkingCode });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Link Your Child
          </CardTitle>
          <CardDescription>
            Connect with your child's account to monitor their progress and stay
            updated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="id"
            className="w-full"
            onValueChange={(value) => setLinkMethod(value as "id" | "code")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="id">Student ID</TabsTrigger>
              <TabsTrigger value="code">Linking Code</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TabsContent value="id" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your child's student ID"
                            {...field}
                            className="text-center font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-gray-600 text-center">
                    You can find the Student ID on report cards or school
                    documents
                  </p>
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
                            placeholder="Enter the 6-digit code"
                            {...field}
                            className="text-center font-mono tracking-wider"
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-gray-600 text-center">
                    Ask your child to generate a linking code from their student
                    portal
                  </p>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={linkChildMutation.isPending}
                >
                  {linkChildMutation.isPending
                    ? "Linking..."
                    : "Link Child Account"}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkChildPage;
