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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSchoolStore } from "@/store/schoolStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { schoolDetails } = useSchoolStore();

  const [classes, setClasses] = useState<{ class_id: string; name: string }[]>(
    []
  );

  const {
    register,
    handleSubmit,
    watch,
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

  const selectedRole = watch("role");
  const selectedClass = watch("class_id");
  const schoolId = schoolDetails?.schoolId;
  const schoolName = schoolDetails?.name;
  const schoolImage = schoolDetails?.schoolImage;

  useEffect(() => {
    const urlSchoolCode = searchParams.get("school_code");
    if (!urlSchoolCode && !schoolDetails?.schoolCode) {
      toast.error("School code missing. Redirecting...");
      router.replace("/");
    }
  }, [searchParams, schoolDetails?.schoolCode, router]);

  useEffect(() => {
    if (selectedRole === "Student" && schoolId) {
      axios
        .get(`/api/school/get-class-no-auth/${schoolId}`)
        .then((res) => {
          console.log("Classes", res.data.data);
          setClasses(res.data.data.classes); // Ensure backend sends { class_id, name }
        })
        .catch(() => toast.error("Failed to fetch classes"));
    }
  }, [selectedRole, schoolId]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      if (!schoolId) {
        toast.error("School ID not found. Please try again.");
        return;
      }

      const response = await axios.post(`/api/auth/register/${schoolId}`, data);
      if (response.status === 200) {
        toast.success("Registration successful!");
        router.push(`/login`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />

      {/* Form Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl">
          <CardHeader className="space-y-1 text-center">
            <img
              src={schoolImage}
              alt={schoolName}
              className="mx-auto w-12 h-12 rounded-full"
            />
            <CardTitle className="text-2xl font-bold uppercase">
              {schoolName}
            </CardTitle>
            <CardDescription>
              Enter your information to register
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  id="first_name"
                  label="First Name"
                  register={register("first_name")}
                  error={errors.first_name}
                />
                <FormField
                  id="last_name"
                  label="Last Name"
                  register={register("last_name")}
                  error={errors.last_name}
                />
              </div>

              <FormField
                id="username"
                label="Username"
                register={register("username")}
                error={errors.username}
              />

              <FormField
                id="email"
                type="email"
                label="Email"
                register={register("email")}
                error={errors.email}
              />

              <FormField
                id="password"
                type="password"
                label="Password"
                register={register("password")}
                error={errors.password}
              />

              {/* Role Select */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select role</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Class Select (Only for Student) */}
              {selectedRole === "Student" && (
                <div>
                  <label
                    htmlFor="class_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Class
                  </label>
                  <select
                    id="class_id"
                    {...register("class_id")}
                    className="w-full border-gray-300 rounded-md shadow-sm px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a class</option>
                    {classes.map((c) => (
                      <option key={c.class_id} value={c.class_id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.class_id && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.class_id.message}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Register"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Already have an account? Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
