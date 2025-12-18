import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const authData = await auth();
  const token = await authData.getToken(); // ✅ NO TEMPLATE

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    token,
    uploadUrl: "https://docuback-pw5d.onrender.com/documents/upload",
  });
}