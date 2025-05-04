import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { restoreUserFromCookie } from "@/utils/restoreAuth";
import { useUserStore } from "@/store/userStore";
import { logoutUser } from "@/services/httpClient";

export function useAuthRedirect() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);

  // On mount, try to restore
  useEffect(() => {
    restoreUserFromCookie();
  }, []);

  // If no user after restore, redirect to login
  useEffect(() => {
    if (!userId) {
      router.replace("/login");
    }
  }, [userId, router]);

  // Return a logout function
  return {
    logout: () => {
      logoutUser();
      router.replace("/login");
    },
  };
}
