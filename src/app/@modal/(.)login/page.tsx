"use client";

import { LoginForm } from "@/components/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginModal() {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
        <LoginForm schoolCode={schoolCode} />
      </div>
    </div>
  );
}
