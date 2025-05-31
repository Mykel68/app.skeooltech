import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  _request: Request,
  context: { params: Promise<{ school_code: string }> }
) {
  try {
    const { params } = await context;
    const backendUrl = process.env.MAIN_BACKEND_URL;
    if (!backendUrl) {
      throw new Error("MAIN_BACKEND_URL is not set");
    }

    const schoolCode = (await params).school_code;

    const response = await axios.get(
      `${backendUrl}/api/schools/code/${schoolCode}`
    );

    // console.log("[API Route] Full response from backend:", response.data);

    const data = response.data;

    if (!data) {
      throw new Error("School not found");
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
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
