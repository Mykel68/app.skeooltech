"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import {
  schoolCodeSchema,
  SchoolCodeFormData,
} from "@/schema/schoolCodeSchema";
import { httpClient } from "@/services/httpClient";
import { useSchoolStore } from "@/store/schoolStore";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export function SchoolCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSchoolDetails, schoolDetails } = useSchoolStore();
  const [openDialog, setOpenDialog] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SchoolCodeFormData>({
    resolver: zodResolver(schoolCodeSchema),
    defaultValues: {
      schoolCode: "",
    },
  });

  const watchedSchoolCode = watch("schoolCode");

  useEffect(() => {
    const schoolCodeFromUrl = searchParams.get("school_code");

    // If no school code in store or url, redirect
    if (!schoolDetails?.schoolCode && !schoolCodeFromUrl) {
      toast.error("School code is missing. Redirecting to home...");
      router.push("/");
    }
  }, [schoolDetails, searchParams, router]);

  const onSubmit = async (data: SchoolCodeFormData) => {
    try {
      const response = await httpClient.client.get(
        `/school/get-code/${data.schoolCode}`
      );
      const schoolData = response.data;

      // Save to Zustand store
      setSchoolDetails({
        schoolId: schoolData.school_id,
        schoolCode: schoolData.school_code,
        name: schoolData.name,
        schoolImage: schoolData.school_image,
      });

      toast.success("School code validated!");
      setOpenDialog(true);
    } catch (error) {
      console.error("[SchoolCodeForm] Error:", error);
      toast.error("Invalid school code. Please try again.");
    }
  };

  const handleLogin = () => {
    const code = schoolDetails?.schoolCode || watchedSchoolCode;
    if (code) {
      setOpenDialog(false);
      router.push(`/login?school_code=${code}`);
    } else {
      toast.error("School code missing. Please start again.");
      router.push("/");
    }
  };

  const handleRegister = () => {
    const code = schoolDetails?.schoolCode || watchedSchoolCode;
    if (code) {
      setOpenDialog(false);
      router.push(`/register?school_code=${code}`);
    } else {
      toast.error("School code missing. Please start again.");
      router.push("/");
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

      {/* Modal/Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>What do you want to do?</DialogHeader>
          <div className="flex flex-col gap-4 p-4">
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              className="w-full"
            >
              Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
