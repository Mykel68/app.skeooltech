// services/authService.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, LoginFormData } from "@/types/auth";
import { useUserStore } from "@/store/userStore";
import axios, { AxiosInstance } from "axios";

export class AuthService {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async loginUser(
    data: LoginFormData
  ): Promise<{ token: string; decoded: DecodedToken }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        school_code: data.school_code,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Login failed");
    }

    const { token } = await res.json();
    if (!token) throw new Error("No token received");

    // Decode and type-check against DecodedToken
    const decoded = jwtDecode<DecodedToken>(token);

    // Persist token
    Cookies.set("s_id", token, { expires: 7 });

    // Hydrate Zustand
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

    return { token, decoded };
  }

  logout() {
    // Remove the token cookie
    Cookies.remove("s_id");
    // Clear the Zustand user store
    useUserStore.getState().clearUser();
  }
}

export const authService = new AuthService();
export const loginUser = authService.loginUser.bind(authService);
export const logoutUser = authService.logout.bind(authService);
