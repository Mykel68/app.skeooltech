import { NextResponse } from "next/server";
import axios from "axios"; // ← import axios here
import { backendClient } from "@/lib/backendClient";

export async function GET(
  _request: Request,
  context: { params: Promise<{ school_code: string }> }
) {
  try {
    const { school_code } = await context.params;

    // Use backendClient (baseURL + x-api-key are already set)
    const resp = await backendClient.get(`/api/schools/code/${school_code}`);
    const data = resp.data;

    if (!data) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Use axios.isAxiosError(...) instead of backendClient.isAxiosError
    if (axios.isAxiosError(error)) {
      console.error("[API Route] Axios error:", error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || "Invalid school code" },
        { status: error.response?.status || 400 }
      );
    }
    console.error("[API Route] Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
