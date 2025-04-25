import { NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";
import { loginSchema } from "@/schema/loginSchema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema
      .omit({ agreeToTerms: true })
      .extend({ schoolCode: z.string().min(3) })
      .parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const response = await axios.post(
      `${backendUrl}/api/auth/login`,
      validatedData
    );
    const { token } = response.data;
    console.log("[API Route] Login response:", { token });

    if (!token) {
      throw new Error("No token received from backend");
    }

    const cookie = `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`;
    return new NextResponse(JSON.stringify({ token }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[API Route] Zod validation error:", error.errors);
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      console.error("[API Route] Axios error:", error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || "Login failed" },
        { status: error.response?.status || 500 }
      );
    }
    console.error("[API Route] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
