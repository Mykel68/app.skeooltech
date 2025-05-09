"use client";

import { SchoolCodeForm } from "@/components/SchoolCodeForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-3">
      <div className="container md:max-w-md px-auto mx-auto space-y-8 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <SchoolCodeForm />
      </div>
    </main>
  );
}
