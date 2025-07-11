import { NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";
import { loginSchema } from "@/schema/loginSchema";
import { backendClient } from "@/lib/backendClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema
      .omit({ agreeToTerms: true })
      .extend({ school_code: z.string().min(3) })
      .parse(body);

    const response = await backendClient.post(
      "/api/auth/teacher-student/login",
      validatedData
    );

    const { token } = response.data.data;
    console.log("[API Route] Login response:", { token });

    const cookie = `s_id=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`;

    return NextResponse.json(
      { token },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[API Route] Zod validation error:", error.errors);
      return NextResponse.json(
        {
          message: "Validation failed.",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    if (axios.isAxiosError(error)) {
      console.error("[API Route] Axios error:", error.response?.data);

      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed.";

      return NextResponse.json(
        { message: backendMessage },
        { status: error.response?.status || 500 }
      );
    }

    console.error("[API Route] Unexpected error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
