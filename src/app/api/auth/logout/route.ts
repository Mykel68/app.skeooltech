import { NextResponse } from "next/server";

export async function POST() {
  // This removes the auth cookie by setting it to expire immediately
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.set("s_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // expired
  });
  return res;
}
