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

      // Create a payload copy and remove `class_id` if role is Teacher
      const payload = { ...data };
      if (payload.role === "Teacher") {
        delete payload.class_id;
      }

      const response = await axios.post(
        `/api/auth/register-teacher-student/${schoolId}`,
        payload
      );

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
    <div className="min-h-screen relative overflow-hidden">
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

      {/* Video Overlay with Green Gradient */}
      <div className="absolute top-0 left-0 w-full h-full  bg-black/60 z-10"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden z-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-3/4 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-bounce delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-lg">
          {/* School Info Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
              <img
                src={schoolImage}
                alt={schoolName}
                className="relative w-20 h-20 rounded-full border-4 border-white/20 shadow-2xl mx-auto"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mt-4 tracking-wide">
              {schoolName}
            </h1>
            <p className="text-green-200 text-lg mt-2">Create Your Account</p>
          </div>

          {/* Registration Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">
                    First Name
                  </label>
                  <input
                    {...register("first_name")}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="text-green-300 text-sm">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">
                    Last Name
                  </label>
                  <input
                    {...register("last_name")}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="text-green-300 text-sm">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Username
                </label>
                <input
                  {...register("username")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="text-green-300 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-green-300 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  placeholder="Create a secure password"
                />
                {errors.password && (
                  <p className="text-green-300 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/90">
                  Role
                </label>
                <select
                  {...register("role")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">
                    Select your role
                  </option>
                  <option value="Student" className="bg-gray-800">
                    Student
                  </option>
                  <option value="Teacher" className="bg-gray-800">
                    Teacher
                  </option>
                </select>
                {errors.role && (
                  <p className="text-green-300 text-sm">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Class Selection (Student Only) */}
              {selectedRole === "Student" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">
                    Select Class
                  </label>
                  <select
                    {...register("class_id")}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">
                      Choose your class
                    </option>
                    {classes.map((c) => (
                      <option
                        key={c.class_id}
                        value={c.class_id}
                        className="bg-gray-800"
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.class_id && (
                    <p className="text-green-300 text-sm">
                      {errors.class_id.message}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-4 focus:ring-emerald-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <Link
                href="/login"
                className="text-green-200 hover:text-white transition-colors duration-300 text-sm underline-offset-4 hover:underline"
              >
                Already have an account? Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
