"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUserStore();
  const [checked, setChecked] = useState(false);

  const role = user?.role;

  useEffect(() => {
    if (!role) return;

    switch (role) {
      case "Student":
        router.replace("/dashboard");
        break;
      case "Teacher":
        router.replace("/home");
        break;
      case "Parent":
        setChecked(true); // allow rendering
        break;
      default:
        router.replace("/");
        break;
    }
  }, [role, router]);

  if (!role || !checked) {
    // Optional: loading spinner or null
    return <div>Please wait...</div>;
  }

  return <main className="">{children}</main>;
}
