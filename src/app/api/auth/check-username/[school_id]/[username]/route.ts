import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

// ✅ GET school profile
export async function GET(
  _request: Request,
  context: { params: Promise<{ school_id: string; username: string }> }
) {
  try {
    const { params } = await context;
    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const response = await backendClient.get(
      `${backendUrl}/api/auth/check-username?username=${
        (
          await params
        ).username
      }&school_id=${(await params).school_id}`
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message || "Failed to fetch username profile",
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
