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
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Users,
  GraduationCap,
  LogIn,
  Check,
  X,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function RegistrationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSchoolDetails, schoolDetails } = useSchoolStore();
  const schoolId = schoolDetails?.schoolId;
  const schoolName = schoolDetails?.name;
  const schoolImage = schoolDetails?.schoolImage;

  const schoolCode = useMemo(() => {
    return searchParams.get("school_code") || schoolDetails?.schoolCode || null;
  }, [searchParams, schoolDetails?.schoolCode]);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: undefined,
      gender: undefined,
      first_name: "",
      last_name: "",
      class_id: undefined,
    },
  });

  const watchedUsername = watch("username");
  const watchedEmail = watch("email");
  const [debouncedUsername] = useDebounce(watchedUsername, 500);
  const [debouncedEmail] = useDebounce(watchedEmail, 500);
  const selectedRole = watch("role");

  // Email availability check
  const {
    data: isEmailAvailable,
    isLoading: isCheckingEmail,
    error: emailError,
  } = useQuery({
    queryKey: ["email-availability", schoolId, debouncedEmail],
    enabled: !!schoolId && !!debouncedEmail && debouncedEmail.length >= 3,
    queryFn: async () => {
      const res = await axios.get(`/api/auth/check-email/${debouncedEmail}`);
      return res.data.data.is_available as boolean;
    },
    retry: false,
    staleTime: 30000,
  });

  // Username availability check
  const {
    data: isUsernameAvailable,
    isLoading: isCheckingUsername,
    error: usernameError,
  } = useQuery({
    queryKey: ["username-availability", schoolId, debouncedUsername],
    enabled: !!schoolId && !!debouncedUsername && debouncedUsername.length >= 3,
    queryFn: async () => {
      const res = await axios.get(
        `/api/auth/check-username/${schoolId}/${debouncedUsername}`
      );
      return res.data.data.is_available as boolean;
    },
    retry: false,
    staleTime: 30000,
  });

  // Redirect if no school code
  useEffect(() => {
    if (!schoolCode) {
      toast.error("School code missing. Redirecting...");
      router.replace("/");
    }
  }, [schoolCode, router]);

  // Fetch school details if missing
  useEffect(() => {
    if (!schoolDetails?.schoolImage && schoolCode) {
      const fetch = async () => {
        try {
          const res = await axios.get(`/school/get-code/${schoolCode}`);
          const d = res.data.data;
          setSchoolDetails({
            schoolId: d.school_id,
            schoolCode: d.school_code,
            name: d.name,
            schoolImage: d.school_image,
          });
        } catch {
          toast.error("Failed to fetch school details.");
          router.replace("/");
        }
      };
      fetch();
    }
  }, [schoolCode, schoolDetails?.schoolImage, setSchoolDetails, router]);

  // Query: fetch classes
  const { data: fetchedClasses = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes", schoolId],
    enabled: selectedRole === "Student" && !!schoolId,
    queryFn: async () => {
      const res = await axios.get(`/api/school/get-class-no-auth/${schoolId}`);
      return res.data.data.classes as {
        class_id: string;
        name: string;
      }[];
    },
  });

  // Mutation: register user
  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      if (!schoolId) throw new Error("School ID missing");
      const payload = { ...data };
      if (payload.role === "Teacher") delete payload.class_id;
      return axios.post(
        `/api/auth/register-teacher-student/${schoolId}`,
        payload
      );
    },
    onSuccess: () => {
      toast.success("Registration successful! Please sign in to continue.");
      router.push(`/login?school_code=${schoolCode}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    // Check username availability before submitting
    if (isUsernameAvailable === false) {
      toast.error("Username is not available. Please choose a different one.");
      return;
    }
    registrationMutation.mutate(data);
  };

  // Function to get username status
  const getUsernameStatus = () => {
    if (!watchedUsername || watchedUsername.length === 0) return null;
    if (watchedUsername.length < 3)
      return {
        type: "info",
        message: "Username must be at least 3 characters",
      };
    if (isCheckingUsername)
      return { type: "loading", message: "Checking availability..." };
    if (usernameError)
      return { type: "error", message: "Error checking username" };
    if (isUsernameAvailable === true)
      return { type: "success", message: "Username is available" };
    if (isUsernameAvailable === false)
      return { type: "error", message: "Username is already taken" };
    return null;
  };

  // Function to get email status
  const getEmailStatus = () => {
    if (!watchedEmail || watchedEmail.length === 0) return null;
    if (watchedEmail.length < 3)
      return {
        type: "info",
        message: "Email must be at least 3 characters",
      };
    if (isCheckingEmail)
      return { type: "loading", message: "Checking availability..." };
    if (emailError) return { type: "error", message: "Error checking email" };
    if (isEmailAvailable === true)
      return { type: "success", message: "Email is available" };
    if (isEmailAvailable === false)
      return { type: "error", message: "Email is already taken" };
    return null;
  };

  const usernameStatus = getUsernameStatus();
  const emailStatus = getEmailStatus();

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
                    src={schoolImage}
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
                  {/* Name */}
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
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
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.last_name.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Username with availability check */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        placeholder="Choose a unique username"
                        className={cn(
                          "pr-10",
                          errors.username &&
                            "border-destructive focus-visible:ring-destructive",
                          usernameStatus?.type === "success" &&
                            "border-green-500 focus-visible:ring-green-500",
                          usernameStatus?.type === "error" &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        {...register("username")}
                      />
                      {/* Status indicator */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus?.type === "loading" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {usernameStatus?.type === "success" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {usernameStatus?.type === "error" && (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                    {/* Status message */}
                    {usernameStatus && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "text-sm font-medium",
                          usernameStatus.type === "success" && "text-green-600",
                          usernameStatus.type === "error" && "text-destructive",
                          usernameStatus.type === "info" &&
                            "text-muted-foreground",
                          usernameStatus.type === "loading" &&
                            "text-muted-foreground"
                        )}
                      >
                        {usernameStatus.message}
                      </motion.p>
                    )}
                    {errors.username && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Email with availability check */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className={cn(
                          "pr-10",
                          errors.email &&
                            "border-destructive focus-visible:ring-destructive",
                          emailStatus?.type === "success" &&
                            "border-green-500 focus-visible:ring-green-500",
                          emailStatus?.type === "error" &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                        {...register("email")}
                      />
                      {/* Status indicator */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {emailStatus?.type === "loading" && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {emailStatus?.type === "success" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {emailStatus?.type === "error" && (
                          <X className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                    {/* Status message */}
                    {emailStatus && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          "text-sm font-medium",
                          emailStatus.type === "success" && "text-green-600",
                          emailStatus.type === "error" && "text-destructive",
                          emailStatus.type === "info" &&
                            "text-muted-foreground",
                          emailStatus.type === "loading" &&
                            "text-muted-foreground"
                        )}
                      >
                        {emailStatus.message}
                      </motion.p>
                    )}
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium text-destructive"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Role and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        onValueChange={(v) =>
                          setValue(
                            "role",
                            v as "Student" | "Teacher" | "Parent"
                          )
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
                          <SelectItem value="Parent">
                            <div className="flex items-center gap-2">
                              <UserPlus className="h-4 w-4" />
                              Parent
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.role.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        onValueChange={(v) =>
                          setValue("gender", v as "Male" | "Female")
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            errors.gender &&
                              "border-destructive focus:ring-destructive"
                          )}
                          style={{ width: "100%" }}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="Male">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Male
                            </div>
                          </SelectItem>
                          <SelectItem value="Female">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Female
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-medium text-destructive"
                        >
                          {errors.gender.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Class (Student only) */}
                  {selectedRole === "Student" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-2"
                    >
                      <Label>Class</Label>
                      <Select
                        onValueChange={(v) => setValue("class_id", v)}
                        disabled={isLoadingClasses || !fetchedClasses.length}
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
                                : fetchedClasses.length
                                ? "Select your class"
                                : "No classes available"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {fetchedClasses.map((c) => (
                            <SelectItem key={c.class_id} value={c.class_id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.class_id && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
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
                    disabled={
                      registrationMutation.isPending ||
                      isUsernameAvailable === false ||
                      isEmailAvailable === false ||
                      isCheckingUsername ||
                      isCheckingEmail
                    }
                  >
                    {registrationMutation.isPending ? (
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
                    <Button variant="outline" className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
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
        <div className="absolute inset-0">
          <img
            src="/images/reg-img.jpg"
            alt="Students learning together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>
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
