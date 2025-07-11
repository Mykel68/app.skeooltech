"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Users } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const linkChildSchema = z.object({
  admission_number: z.string().max(20, "Admission number too long").optional(),
  linkingCode: z.string().max(10, "Linking code too long").optional(),
});

type LinkChildForm = z.infer<typeof linkChildSchema>;

const linkChild = async (data: {
  admission_number?: string;
  linkingCode?: string;
}) => {
  const response = await axios.post("/api/parent/link-child", data, {
    withCredentials: true,
  });
  return response.data;
};

const LinkChildPage = () => {
  const [linkMethod, setLinkMethod] = useState<"admission" | "code">(
    "admission"
  );
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const form = useForm<LinkChildForm>({
    resolver: zodResolver(linkChildSchema),
    defaultValues: {
      admission_number: "",
      linkingCode: "",
    },
  });

  const linkChildMutation = useMutation({
    mutationFn: linkChild,
    onSuccess: () => {
      toast.success("Child account successfully linked!");
      setUser({
        is_approved: true,
      });
      router.push("/parent/home");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to link child.";
      toast.error(message);
    },
  });

  const onSubmit = (data: LinkChildForm) => {
    if (linkMethod === "admission") {
      if (!data.admission_number) {
        toast.error("Please enter the Admission Number.");
        return;
      }
      linkChildMutation.mutate({ admission_number: data.admission_number });
    } else {
      if (!data.linkingCode) {
        toast.error("Please enter the linking code.");
        return;
      }
      linkChildMutation.mutate({ linkingCode: data.linkingCode });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
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
            defaultValue="admission"
            className="w-full"
            onValueChange={(value) =>
              setLinkMethod(value as "admission" | "code")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admission">Admission Number</TabsTrigger>
              <TabsTrigger value="code">Linking Code</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TabsContent value="admission" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="admission_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your child's admission number"
                            {...field}
                            className="text-center font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p className="text-sm text-gray-600 text-center">
                    You can find the admission number on report cards or school
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
                  className="w-full bg-green-600 hover:bg-green-700"
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
