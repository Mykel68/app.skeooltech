"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  schoolCodeSchema,
  type SchoolCodeFormData,
} from "@/schema/schoolCodeSchema";
import { AuthService } from "@/services/httpClient";
import { useSchoolStore } from "@/store/schoolStore";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, LogIn, UserPlus } from "lucide-react";

export function SchoolCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSchoolDetails, schoolDetails } = useSchoolStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

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
          setIsInitializing(true);
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
        } finally {
          setIsInitializing(false);
        }
      };

      fetchData();
    } else if (!schoolCodeFromUrl && !storedCode) {
      setIsInitializing(false);
    } else {
      setIsInitializing(false);
    }
  }, [router, searchParams, schoolDetails?.schoolCode, setSchoolDetails]);

  const onSubmit = async (data: SchoolCodeFormData) => {
    setIsLoading(true);
    try {
      const authService = new AuthService();
      const response = await authService.client.get(
        `/school/get-code/${data.schoolCode}`
      );
      const schoolData = response.data.data;

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
    } finally {
      setIsLoading(false);
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

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Verifying school code...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="schoolCode" className="text-sm font-medium">
            School Code
          </Label>
          <div className="relative">
            <Input
              id="schoolCode"
              placeholder="Enter your school code (e.g., ABC123)"
              className={`pr-10 ${
                errors.schoolCode
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
              {...register("schoolCode")}
            />
          </div>
          {errors.schoolCode && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-500 mt-1"
            >
              {errors.schoolCode.message}
            </motion.p>
          )}
        </div>

        <Button type="submit" className="w-full group" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
          )}
          Continue
        </Button>
      </motion.form>

      {/* School Selection Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Welcome to your school portal
            </DialogTitle>
          </DialogHeader>

          {/* School details */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/30 p-4 rounded-full mb-4">
              {schoolDetails?.schoolImage ? (
                <img
                  src={schoolDetails.schoolImage || "/placeholder.svg"}
                  alt={schoolDetails.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {schoolDetails?.name?.charAt(0) || "S"}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold mb-1">{schoolDetails?.name}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              School Code: {schoolDetails?.schoolCode}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
            <Button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
