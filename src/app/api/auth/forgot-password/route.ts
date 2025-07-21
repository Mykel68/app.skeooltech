import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { backendClient } from "@/lib/backendClient";

const classSchemaa = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[POST] Body:", body);
    const validated = classSchemaa.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL!;

    const resp = await backendClient.post(
      `${backendUrl}/api/auth/forgot-password`,
      validated
    );

    return NextResponse.json(resp.data, { status: 200 });
  } catch (err: any) {
    console.log("errors", err.message);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || "Failed to send email" },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
