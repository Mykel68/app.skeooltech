"use client";

import { LoginForm } from "@/components/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const schoolCode = searchParams.get("school_code");

  if (!schoolCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">No school code provided.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <LoginForm schoolCode={schoolCode} />
      </div>
    </main>
  );
}
