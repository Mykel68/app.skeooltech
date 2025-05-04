// utils/restoreAuth.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/auth";
import { useUserStore } from "@/store/userStore";

export function restoreUserFromCookie() {
  const token = Cookies.get("s_id");
  if (!token) return;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    // check expiration
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("s_id");
      return;
    }

    useUserStore.getState().setUser({
      userId: decoded.user_id,
      username: decoded.username,
      role: decoded.role,
      schoolId: decoded.school_id,
      firstName: decoded.first_name,
      lastName: decoded.last_name,
      email: decoded.email,
      schoolName: decoded.school_name,
      schoolImage: decoded.school_image,
    });
  } catch {
    Cookies.remove("s_id");
  }
}
