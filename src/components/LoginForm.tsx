"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/FormField";
import { PasswordField } from "@/components/PasswordField";
import { loginSchema, LoginFormData } from "@/schema/loginSchema";
import { loginUser } from "@/services/httpClient";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import Link from "next/link";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { DecodedToken } from "@/types/auth";

export function LoginForm({ schoolCode }: { schoolCode: string }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const schoolId = useUserStore((state) => state.schoolId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      school_code: schoolCode,
      agreeToTerms: false,
    },
  });

  // const onSubmit = async (formData: LoginFormData) => {
  //   console.log("[LoginForm] submitting", formData);
  //   try {
  //     const response = await axios.post(`/api/auth/login`, formData);
  //     console.log("[LoginForm] response", response.data);

  //     if (response.status === 200) {
  //       const token = response.data.token;

  //       // ✅ Save token to cookie
  //       Cookies.set("token", token, { expires: 7 }); // expires in 7 days

  //       const decoded = jwtDecode<DecodedToken>(token);
  //       console.log("[LoginForm] Decoded token:", decoded);

  //       setUser({
  //         userId: decoded.user_id,
  //         username: decoded.username,
  //         role: decoded.role,
  //         schoolId: decoded.school_id,
  //         firstName: decoded.first_name,
  //         lastName: decoded.last_name,
  //         email: decoded.email,
  //         schoolName: decoded.school_name,
  //         schoolImage: decoded.school_image,
  //         is_approved: decoded.is_approved,
  //         schoolCode: decoded.school_code,
  //       });

  //       const { role, is_approved } = decoded;

  //       if (role === "Teacher") {
  //         router.push(is_approved ? "/home" : "/awaiting");
  //       } else if (role === "Student") {
  //         router.push(is_approved ? "/dashboard" : "/awaiting");
  //       }

  //       toast.success("Login successful!");
  //     } else {
  //       toast.error("Login failed. Please try again.");
  //     }
  //   } catch (error: any) {
  //     console.error("[LoginForm] Error:", error);
  //     toast.error(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Login failed. Please try again."
  //     );
  //   }
  // };

  const onSubmit = async (formData: LoginFormData) => {
    console.log("[LoginForm] submitting", formData);
    try {
      const response = await axios.post(`/api/auth/login`, formData);
      console.log("[LoginForm] response", response.data);

      console.log("Response status", response.status);

      if (response.status === 200) {
        const token = response.data.token;
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("[LoginForm] Decoded token:", decoded);

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

        if (role === "Teacher") {
          router.push(is_approved ? "/home" : "/awaiting");
        } else if (role === "Student") {
          router.push(is_approved ? "/dashboard" : "/awaiting");
        } else if (role === "Admin") {
          toast.error("You are an Admin. Login on your admin portal.");
          return; // 🔒 prevent further execution
        } else {
          toast.error("Unknown role. Contact support.");
          return;
        }

        toast.success("Login successful!");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: any) {
      console.error("[LoginForm] Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hidden school code field */}
      <input type="hidden" value={schoolCode} {...register("school_code")} />

      <div className="grid grid-cols-1 gap-4">
        <FormField
          id="username"
          label="Username"
          placeholder="Enter your username"
          register={register("username")}
          error={errors.username}
        />
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          register={register("password")}
          error={errors.password}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="agreeToTerms"
          {...register("agreeToTerms")}
          className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
        />
        <label
          htmlFor="agreeToTerms"
          className="ml-2 block text-sm text-gray-700"
        >
          I agree to the terms & policy
        </label>
      </div>

      {errors.agreeToTerms && (
        <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>
      <p className="text-sm">
        No account yet?{" "}
        <Link href={`/register?school_code=${schoolCode}`}>Create</Link>
      </p>
    </form>
  );
}
