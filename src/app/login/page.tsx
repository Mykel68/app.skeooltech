"use client";

import { LoginForm } from "@/components/LoginForm";
import { useSchoolStore } from "@/store/schoolStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { schoolDetails, setSchoolDetails } = useSchoolStore();

  const schoolCode = useMemo(() => {
    return searchParams.get("school_code") || schoolDetails?.schoolCode || null;
  }, [searchParams, schoolDetails?.schoolCode]);

  // Fetch school details if not in store
  const { data: school, isLoading } = useQuery({
    queryKey: ["school", schoolCode],
    queryFn: async () => {
      if (!schoolCode) throw new Error("No school code");
      const { data } = await axios.get(`/api/school/get-code/${schoolCode}`);
      // populate store
      setSchoolDetails({
        schoolId: data.school_id,
        schoolCode: data.school_code,
        name: data.name,
        schoolImage: data.school_image,
      });
      return data;
    },
    enabled: !!schoolCode,
    initialData: schoolDetails,
  });

  useEffect(() => {
    if (!schoolCode) {
      toast.error("School code missing. Redirecting...");
      router.push("/");
    }
  }, [schoolCode, router]);

  if (!schoolCode || isLoading) {
    return null; // or a spinner
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen md:h-screen p-3">
      {/* Form Section - 35% on large screens */}
      <div className="w-full lg:w-[35%] p-8 flex flex-col justify-center">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-8">
            {school?.school_image && (
              <img
                src={school.school_image}
                alt={school.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div className="font-bold uppercase text-lg">{school?.name}</div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Login to your account</h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <LoginForm schoolCode={schoolCode} />
      </div>
      <div className="hidden lg:block lg:w-[65%] relative">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img
          src="/images/reg-img.jpg"
          alt="Volunteers hands together"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-16 left-16 right-16 text-white z-20">
          <h2 className="text-5xl font-bold">Together,</h2>
          <h2 className="text-5xl font-bold">we make a difference</h2>
        </div>
      </div>
    </div>
  );
}
