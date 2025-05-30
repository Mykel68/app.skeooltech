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
import { AuthService } from "@/services/httpClient";
import { useSchoolStore } from "@/store/schoolStore";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export function SchoolCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSchoolDetails, schoolDetails } = useSchoolStore();
  const [openDialog, setOpenDialog] = useState(false);

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
    const storedCode = localStorage.getItem("school_code");

    const codeToUse = schoolCodeFromUrl || storedCode;

    if (!schoolDetails?.schoolCode && codeToUse) {
      const fetchData = async () => {
        try {
          const authService = new AuthService();
          const response = await authService.client.get(
            `/school/get-code/${codeToUse}`
          );
          const schoolData = response.data;

          setSchoolDetails({
            schoolId: schoolData.school_id,
            schoolCode: schoolData.school_code,
            name: schoolData.name,
            schoolImage: schoolData.school_image,
          });

          localStorage.setItem("school_code", schoolData.school_code);
        } catch (error) {
          toast.error("Invalid or expired school code.");
          router.push("/");
        }
      };

      fetchData();
    } else if (!schoolCodeFromUrl && !storedCode) {
      toast.error("School code is missing. Redirecting to home...");
      router.push("/");
    }
  }, [router, searchParams, schoolDetails?.schoolCode, setSchoolDetails]);

  const onSubmit = async (data: SchoolCodeFormData) => {
    try {
      const authService = new AuthService();
      const response = await authService.client.get(
        `/school/get-code/${data.schoolCode}`
      );
      const schoolData = response.data.data;
      console.log("schoolData", schoolData);

      setSchoolDetails({
        schoolId: schoolData.school_id,
        schoolCode: schoolData.school_code,
        name: schoolData.name,
        schoolImage: schoolData.school_image,
      });

      localStorage.setItem("school_code", schoolData.school_code);

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
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      {/* Modal/Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          {/* School details header */}
          <div className="flex items-center gap-4 mb-4">
            {schoolDetails?.schoolImage && (
              <img
                src={schoolDetails.schoolImage}
                alt={schoolDetails.name}
                className="w-12 h-12 rounded-full"
              />
            )}
            <h3 className="text-lg font-semibold">{schoolDetails?.name}</h3>
          </div>

          <DialogHeader>How would you like to proceed?</DialogHeader>

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
