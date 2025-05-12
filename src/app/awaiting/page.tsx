"use client";

import React from "react";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";

export default function AwaitingApprovalPage() {
  const firstName = useUserStore((s) => s.firstName);
  const lastName = useUserStore((s) => s.lastName);
  const schoolName = useUserStore((s) => s.schoolName);
  const schoolImage = useUserStore((s) => s.schoolImage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center max-w-md w-full space-y-5">
        {schoolImage && (
          <img
            src={schoolImage}
            alt="School Logo"
            className="w-14 h-14 mx-auto rounded-full object-cover"
          />
        )}

        {schoolName && (
          <h2 className="text-lg font-semibold uppercase text-gray-700">
            {schoolName}
          </h2>
        )}

        <p className="text-gray-600 text-[1rem] text-pretty">
          Hello{" "}
          <span className="font-medium text-gray-800">
            {firstName} {lastName}
          </span>
          ,
          <br />
          your account is pending approval.
        </p>

        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-14  rounded-lg object-cover "
        >
          <source src="/videos/hour_glass.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="animate-spin w-5 h-5" />
          <span className="text-sm">Waiting for admin approval...</span>
        </div>

        <p className="text-xs text-gray-400">
          You&apos;ll be notified once your account is approved.
        </p>
      </div>
    </div>
  );
}
