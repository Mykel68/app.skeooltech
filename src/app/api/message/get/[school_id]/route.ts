import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { backendClient } from "@/lib/backendClient";

// ✅ GET school profile
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      school_id: string;
    }>;
  }
) {
  try {
    const { school_id } = await context.params;
    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    // const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("s_id")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await backendClient.get(
      `${backendUrl}/api/messages/user/${school_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.log("error", error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error:
            error.response?.data?.message || "Failed to fetch school profile",
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
