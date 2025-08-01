import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

// ✅ GET school profile
export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      session_id: string;
      term_id: string;
      teacher_id: string;
    }>;
  }
) {
  try {
    const { params } = await context;
    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("s_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await backendClient.get(
      `${backendUrl}/api/subjects/teacher/${
        (
          await params
        ).teacher_id
      }?session_id=${(await params).session_id}&term_id=${
        (
          await params
        ).term_id
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message ||
            "Failed to fetch subjects by teacher",
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
