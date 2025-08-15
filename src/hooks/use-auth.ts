import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import axios from "axios";

export function useLogout() {
  const router = useRouter();
  const clearUser = useUserStore((s) => s.clearUser);

  const handleLogout = async () => {
    try {
      // Call API route to clear cookie
      await axios.post("/api/auth/logout");

      // Clear Zustand store
      clearUser();

      // Redirect to login/home
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return handleLogout;
}
