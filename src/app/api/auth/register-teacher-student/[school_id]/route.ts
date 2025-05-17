import { NextResponse } from "next/server";
import axios from "axios";
import { registrationSchema } from "@/schema/registrationSchema";
import { z } from "zod";

export async function POST(
  request: Request,
  context: { params: { school_id: string } }
) {
  try {
    // Wait for the params to be available before using them
    const { school_id } = await context.params;

    // Ensure school_id is valid
    if (!school_id) {
      return NextResponse.json(
        { error: "Invalid school_id provided." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = registrationSchema.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

    // Sending the request to the backend
    const response = await axios.post(
      `${backendUrl}/api/auth/register-teacher-student/${school_id}`,
      validatedData
    );

    return NextResponse.json(response.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[API Route] Zod validation error:", error.errors);
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    if (axios.isAxiosError(error)) {
      console.error("[API Route] Axios error:", error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || "Registration failed" },
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
