"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/schema/registrationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useSchoolStore } from "@/store/schoolStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Users,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/httpClient";

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [classes, setClasses] = useState<{ class_id: string; name: string }[]>(
    []
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const { setSchoolDetails, schoolDetails } = useSchoolStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: undefined,
      first_name: "",
      last_name: "",
      class_id: undefined,
    },
  });

  const selectedRole = watch("role");
  const schoolCodeFromUrl = searchParams.get("school_code");
  const schoolId = schoolDetails?.schoolId;
  const schoolName = schoolDetails?.name;
  const schoolImage = schoolDetails?.schoolImage;
  const schoolCode = schoolCodeFromUrl || schoolDetails?.schoolCode;

  useEffect(() => {
    if (!schoolCode && !schoolDetails?.schoolCode) {
      toast.error("School code missing. Redirecting...");
      router.replace("/");
    }
  }, [schoolCode, schoolDetails?.schoolCode, router]);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      if (!schoolDetails?.schoolImage && schoolCode) {
        try {
          const authService = new AuthService();
          const response = await authService.client.get(
            `/school/get-code/${schoolCode}`
          );
          const schoolData = response.data.data;

          setSchoolDetails({
            schoolId: schoolData.school_id,
            schoolCode: schoolData.school_code,
            name: schoolData.name,
            schoolImage: schoolData.school_image,
          });
        } catch (error) {
          console.error("Failed to fetch school details:", error);
          toast.error("Failed to fetch school details.");
          router.replace("/");
        }
      }
    };

    fetchSchoolDetails();
  }, [schoolCode, schoolDetails?.schoolImage, setSchoolDetails]);

  useEffect(() => {
    if (selectedRole === "Student" && schoolId) {
      setIsLoadingClasses(true);
      axios
        .get(`/api/school/get-class-no-auth/${schoolId}`)
        .then((res) => {
          setClasses(res.data.data.classes || []);
        })
        .catch(() => {
          toast.error("Failed to fetch classes");
          setClasses([]);
        })
        .finally(() => setIsLoadingClasses(false));
    } else {
      setClasses([]);
      setValue("class_id", undefined);
    }
  }, [selectedRole, schoolId, setValue]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      if (!schoolId) {
        toast.error("School ID not found. Please try again.");
        return;
      }

      const payload = { ...data };
      if (payload.role === "Teacher") {
        delete payload.class_id;
      }

      const response = await axios.post(
        `/api/auth/register-teacher-student/${schoolId}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Registration successful! Please sign in to continue.");
        router.push(`/login?school_code=${schoolCode}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center p-6 lg:p-12 bg-background relative">
        <div className="max-w-md mx-auto w-full">
          {/* School Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-8">
              {schoolImage ? (
                <div className="relative">
                  <img
                    src={schoolImage || "/placeholder.svg"}
                    alt={schoolName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-lg font-bold text-primary">
                    {schoolName?.charAt(0) || "S"}
                  </span>
                </div>
              )}
              <div>
                <h2 className="font-bold text-lg text-foreground">
                  {schoolName}
                </h2>
                <p className="text-xs text-muted-foreground">School Portal</p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Create your account
              </h1>
              <p className="text-muted-foreground">
                Join your school community today
              </p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Registration Details</CardTitle>
                <CardDescription>
                  Fill in your information to get started
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        placeholder="Enter first name"
                        className={cn(
                          errors.first_name &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        {...register("first_name")}
                      />
                      {errors.first_name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.first_name.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        placeholder="Enter last name"
                        className={cn(
                          errors.last_name &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        {...register("last_name")}
                      />
                      {errors.last_name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.last_name.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Choose a unique username"
                      className={cn(
                        errors.username &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("username")}
                    />
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className={cn(
                        errors.email &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                      {...register("email")}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        className={cn(
                          "pr-10",
                          errors.password &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        {...register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2 ">
                    <Label>Role</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("role", value as "Student" | "Teacher")
                      }
                    >
                      <SelectTrigger
                        className={cn(
                          errors.role &&
                            "border-destructive focus:ring-destructive"
                        )}
                        style={{ width: "100%" }}
                      >
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        <SelectItem value="Student">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Student
                          </div>
                        </SelectItem>
                        <SelectItem value="Teacher">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Teacher
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.role.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Class Selection (Student Only) */}
                  {selectedRole === "Student" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <Label>Class</Label>
                      <Select
                        onValueChange={(value) => setValue("class_id", value)}
                        disabled={isLoadingClasses || classes.length === 0}
                      >
                        <SelectTrigger
                          className={cn(
                            errors.class_id &&
                              "border-destructive focus:ring-destructive"
                          )}
                          style={{ width: "100%" }}
                        >
                          <SelectValue
                            placeholder={
                              isLoadingClasses
                                ? "Loading classes..."
                                : classes.length === 0
                                ? "No classes available"
                                : "Select your class"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem
                              key={classItem.class_id}
                              value={classItem.class_id}
                            >
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.class_id && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.class_id.message}
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-0">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>

                <div className="text-center flex items-center gap-4 justify-center">
                  <p className="text-sm text-nowrap text-muted-foreground">
                    Already have an account?
                  </p>
                  <Link
                    href={`/login?school_code=${schoolCode}`}
                    className="flex items-center w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/reg-img.jpg"
            alt="Students learning together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Start Your
                <br />
                <span className="text-white/90">Learning Journey</span>
              </h2>
              <p className="text-xl text-white/80 max-w-md">
                Join a community of learners and educators dedicated to academic
                excellence and personal growth.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-white/90">
                  Access to quality education resources
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-white/90">
                  Connect with teachers and classmates
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <UserPlus className="h-4 w-4" />
                </div>
                <span className="text-white/90">
                  Track your academic progress
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
