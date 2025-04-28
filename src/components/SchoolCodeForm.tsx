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
import Link from "next/link";

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
      await httpClient.client.get(`/school/get-code/${data.schoolCode}`);
      toast.success("School code validated successfully!");
      router.push(`/login?school_code=${data.schoolCode}`);
    } catch (error) {
      console.error("[SchoolCodeForm] Error:", error);
      toast.error("Invalid school code. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4"
      >
        <FormField
          id="schoolCode"
          label="School Code"
          placeholder="Enter your school code (e.g., ABC123)"
          register={register("schoolCode")}
          error={errors.schoolCode}
        />
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Continue
        </Button>
      </form>
      <div className="space-y-2">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">
            Don&apos;t have an account{" "}
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <Link
          href={"#"}
          className="text-sm flex items-center justify-center hover:underline-offset-3 hover:underline"
        >
          Register Here
        </Link>
      </div>
    </div>
  );
}
