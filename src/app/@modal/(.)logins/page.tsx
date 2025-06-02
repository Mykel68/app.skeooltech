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
import { useSchoolStore } from "@/store/schoolStore";

export default function SchoolCodeForm() {
  const router = useRouter();
  const setSchoolDetails = useSchoolStore((s) => s.setSchoolDetails);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolCodeFormData>({
    resolver: zodResolver(schoolCodeSchema),
    defaultValues: { schoolCode: "" },
  });

  if (!schoolCode && !schoolDetails?.schoolCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">No school code provided.</p>
      </div>
    );
  }

  const onSubmit = async (data: SchoolCodeFormData) => {
    try {
      console.log("[SchoolCodeForm] Submitting school code:", data.schoolCode);
      const resp = await httpClient.client.get(
        `/school/get-code/${data.schoolCode}`
      );
      // API returns { data: { school_id, name, address, school_image, phone_number, school_code } }
      const payload = resp.data.data;

      const details = {
        schoolId: payload.school_id,
        schoolCode: payload.school_code,
        name: payload.name,
        schoolImage: payload.school_image,
      };

      // Persist in store
      setSchoolDetails(details);

      toast.success("School code validated successfully!");
      // Use replace to avoid keeping the form mounted in intercepting routes
      router.replace(`/login?school_code=${payload.school_code}`);
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
          Login
        </Button>
      </form>

      <div className="space-y-2">
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">
            Don&apos;t have an account?
          </span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <Link
          href="#"
          className="text-sm flex items-center justify-center hover:underline hover:underline-offset-3"
        >
          Register Here
        </Link>
      </div>
    </div>
  );
}
