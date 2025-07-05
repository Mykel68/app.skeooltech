"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/schema/loginSchema";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LoginForm({ schoolCode }: { schoolCode: string }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      school_code: schoolCode,
      agreeToTerms: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const response = await axios.post(`/api/auth/login`, formData);

      if (response.status === 200) {
        const token = response.data.token;
        const decoded = jwtDecode<DecodedToken>(token);

        setUser({
          userId: decoded.user_id,
          username: decoded.username,
          role: decoded.role,
          schoolId: decoded.school_id,
          firstName: decoded.first_name,
          lastName: decoded.last_name,
          email: decoded.email,
          schoolName: decoded.school_name,
          schoolImage: decoded.school_image,
          is_approved: decoded.is_approved,
          schoolCode: decoded.school_code,
        });

        const { role, is_approved } = decoded;

        let destination;

        if (role === "Teacher") {
          destination = is_approved ? "/home" : "/awaiting";
        } else if (role === "Student") {
          destination = is_approved ? "/dashboard" : "/awaiting";
        } else if (role === "Parent") {
          destination = is_approved ? "/parent/home" : "/awaiting";
        } else if (role === "Admin") {
          toast.error("You are an Admin. Login on your admin portal.");
          return;
        } else {
          toast.error("Unknown role. Contact support.");
          return;
        }

        router.push(destination);

        toast.success("Welcome back! Login successful.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("[LoginForm] Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <Card className="border shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hidden school code field */}
          <input
            type="hidden"
            value={schoolCode}
            {...register("school_code")}
          />

          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className={cn(
                  "transition-colors",
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

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={cn(
                    "pr-10 transition-colors",
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

            {/* Terms Checkbox */}
            <div className="flex items-center space-x-2 mt-8">
              <Checkbox
                id="agreeToTerms"
                checked={watchedValues.agreeToTerms}
                onCheckedChange={(checked) =>
                  setValue("agreeToTerms", checked as boolean)
                }
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  terms & conditions
                </Link>
              </Label>
            </div>
            {errors.agreeToTerms && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-sm font-medium text-destructive"
              >
                {errors.agreeToTerms.message}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
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
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="text-center flex gap-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account yet?
          </p>
          <Link
            href={`/register?school_code=${schoolCode}`}
            className="text-sm flex items-center justify-center hover:underline"
          >
            <UserPlus className="mr-1 h-3 w-3" />
            Create Account
          </Link>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Forgot Password?{" "}
          <Link
            href={`/forgot?school_code=${schoolCode}`}
            className="text-green-700 hover:underline"
          >
            Here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
