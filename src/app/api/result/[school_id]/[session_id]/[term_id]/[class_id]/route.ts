import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      school_id: string;
      session_id: string;
      term_id: string;
      class_id: string;
    }>;
  }
) {
  const { school_id } = await context.params;
  const { class_id } = await context.params;
  const { session_id } = await context.params;
  const { term_id } = await context.params;

  const backendUrl = process.env.MAIN_BACKEND_URL;
  if (!backendUrl) throw new Error("MAIN_BACKEND_URL is not set");

  const cookieStore = await cookies();
  // make sure this matches whatever your auth cookie is actually called
  const token = cookieStore.get("s_id")?.value;
  //   console.log("→ token from cookie:", token);

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: no token" },
      { status: 401 }
    );
  }

  try {
    const response = await axios.get(
      `${backendUrl}/api/results/${school_id}/${class_id}?session_id=${session_id}&term_id=${term_id}`,
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
          error: err.response?.data?.message || "Failed to fetch results",
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
