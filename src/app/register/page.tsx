"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/schema/registrationSchema";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { httpClient } from "@/services/httpClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Mail, Lock, User, Users } from "lucide-react";
import Link from "next/link";

// Import your store
import { useSchoolStore } from "@/store/schoolStore"; // adjust path if needed
import { useEffect } from "react";

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { schoolDetails } = useSchoolStore();

  useEffect(() => {
    const urlSchoolCode = searchParams.get("school_code");

    if (!urlSchoolCode && !schoolDetails?.schoolCode) {
      toast.error("School code missing. Redirecting...");
      router.replace("/");
    }
  }, [searchParams, schoolDetails?.schoolCode, router]);

  const activeSchoolCode =
    searchParams.get("school_code") || schoolDetails?.schoolCode;

  // Correct way to get the schoolId
  const schoolId = useSchoolStore((state) => state.schoolDetails?.schoolId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "Student" as const,
      first_name: "",
      last_name: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      if (!schoolId) {
        toast.error("School ID not found. Please try again.");
        return;
      }

      await httpClient.client.post(`/auth/register/${schoolId}`, data);
      toast.success("Registration successful!");
      router.push(`/login`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <FormField
                id="username"
                label="Username"
                register={register("username")}
                error={errors.username}
              />
              <UserPlus className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Email */}
            <div className="relative">
              <FormField
                id="email"
                type="email"
                label="Email"
                register={register("email")}
                error={errors.email}
              />
              <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <FormField
                id="password"
                type="password"
                label="Password"
                register={register("password")}
                error={errors.password}
              />
              <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
            </div>

            {/* Role */}
            <div className="relative">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  {...register("role")}
                  className="pl-10 mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FormField
                  id="first_name"
                  label="First Name"
                  register={register("first_name")}
                  error={errors.first_name}
                />
                <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              </div>

              <div className="relative">
                <FormField
                  id="last_name"
                  label="Last Name"
                  register={register("last_name")}
                  error={errors.last_name}
                />
                <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-sm text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
