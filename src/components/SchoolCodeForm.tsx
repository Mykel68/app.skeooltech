"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import {
  schoolCodeSchema,
  SchoolCodeFormData,
} from "@/schema/schoolCodeSchema";
import { httpClient } from "@/services/httpClient";

export function SchoolCodeForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolCodeFormData>({
    resolver: zodResolver(schoolCodeSchema),
    defaultValues: {
      schoolCode: "",
    },
  });

  const onSubmit = async (data: SchoolCodeFormData) => {
    try {
      console.log("[SchoolCodeForm] Submitting school code:", data);
      // Validate school code with backend
      // await httpClient.client.get(
      //   `/school/validate?school_code=${data.schoolCode}`
      // );
      router.push(`/login?school_code=${data.schoolCode}`);
    } catch (error) {
      console.error("[SchoolCodeForm] Error:", error);
      toast.error("Invalid school code. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="schoolCode"
        label="School Code"
        placeholder="Enter your school code (e.g., ABC123)"
        register={register("schoolCode")}
        error={errors.schoolCode}
      />
      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
        Continue
      </Button>
    </form>
  );
}
