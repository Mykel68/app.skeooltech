import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      school_id: string;
      student_id: string;
    }>;
  }
) {
  const { school_id, student_id } = await context.params;
  const backendUrl = process.env.MAIN_BACKEND_URL;
  if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

  const cookieStore = await cookies();
  const token = cookieStore.get("s_id")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    const response = await backendClient.get(
      //   `${backendUrl}/api/attendance/today?school_id=${school_id}&session_id=${session_id}&term_id=${term_id}&class_id=${class_id}&date=${date}`,
      `${backendUrl}/api/attendance/student/${school_id}/${student_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Backend error:", err.response?.data);
      return NextResponse.json(
        {
          error: err.response?.data?.message || "Failed to fetch attendance",
        },
        { status: err.response?.status || 500 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
