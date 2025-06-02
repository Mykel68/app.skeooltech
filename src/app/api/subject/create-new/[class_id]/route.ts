import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { cookies } from "next/headers";

const classSchemaa = z.object({
  name: z.string().min(2),
  short: z.string().optional(),
  //   school_code: z.string().min(1),
});

export async function POST(
  request: Request,
  // tell TS that params is a Promise
  { params }: { params: Promise<{ class_id: string }> }
) {
  try {
    // await params before destructuring
    const { class_id } = await params;

    const body = await request.json();
    // console.log("[POST] Body:", body);
    const validated = classSchemaa.parse(body);

    const backendUrl = process.env.MAIN_BACKEND_URL!;
    const token = (await cookies()).get("s_id")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resp = await axios.post(
      `${backendUrl}/api/subjects/${class_id}`,
      validated,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json(resp.data, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { error: err.response?.data?.message || "Update failed" },
        { status: err.response?.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
