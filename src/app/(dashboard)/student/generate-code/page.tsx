"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export default function GenerateLinkCodePage() {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const userId = useUserStore((s) => s.userId);

  // Mutation to call your backend
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "/api/student/generate-link-code",
        {
          student_user_id: userId,
        },
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      setGeneratedCode(data.code);
      toast.success("Linking code generated!");
    },
    onError: () => {
      toast.error("Failed to generate linking code. Please try again.");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Generate Linking Code</CardTitle>
          <CardDescription>
            Share this code with your parent so they can link to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => generateCodeMutation.mutate()}
            disabled={generateCodeMutation.isPending}
          >
            {generateCodeMutation.isPending ? "Generating..." : "Generate Code"}
          </Button>

          {generatedCode && (
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                Your Linking Code:
              </p>
              <Input
                value={generatedCode}
                readOnly
                className="text-center font-mono text-lg tracking-wider"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
