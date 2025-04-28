import axios, { AxiosInstance } from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginFormData } from "@/schema/loginSchema";

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
  schoolId: string;
  iat: number;
  exp: number;
}

export class HttpClient {
  private client: AxiosInstance;

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
    try {
      const response = await this.client.post("/auth/login", {
        username: data.username,
        password: data.password,
        school_code: data.schoolCode,
        agreeToTerms: undefined,
      });
      console.log("[HttpClient] Login API response:", response.data);
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from backend");
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log("[HttpClient] Decoded token:", decoded);
        return { token, decoded };
      } catch (decodeError) {
        throw new Error("Failed to decode token");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("[HttpClient] Login error:", error.message);
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error("Login failed: Unknown error");
    }
  }
}

export const httpClient = new HttpClient();
export const loginUser = httpClient.loginUser.bind(httpClient);
