import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get Clerk JWT (App Router → await)
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Get incoming file
    const formData = await req.formData();

    // 3️⃣ Forward to backend
    const backendRes = await fetch(
      "https://docuback-pw5d.onrender.com/users/avatar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT set Content-Type manually for FormData
        },
        body: formData,
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Avatar upload failed" },
        { status: backendRes.status }
      );
    }

    // 4️⃣ Return backend response
    return NextResponse.json(data);

  } catch (err) {
    console.error("Avatar upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}