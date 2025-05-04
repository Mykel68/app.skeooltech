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

export function LoginForm({ schoolCode }: { schoolCode: string }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

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

  const onSubmit = async (formData: LoginFormData) => {
    console.log("[LoginForm] submitting", formData);
    try {
      const data = await loginUser(formData);
      console.log("[LoginForm] response", data);
      setUser({
        userId: data.decoded.user_id,
        username: data.decoded.username,
        role: data.decoded.role,
        schoolId: data.decoded.school_id,
        firstName: data.decoded.first_name,
        lastName: data.decoded.last_name,
        email: data.decoded.email,
        schoolName: data.decoded.school_name,
        schoolImage: data.decoded.school_image,
      });
      toast.success("Login successful!");
      router.push("/dashboard");
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
    </form>
  );
}
