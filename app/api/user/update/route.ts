import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get Clerk JWT
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Forward body to backend
    const body = await req.json();

    const backendRes = await fetch(
      "https://docuback-pw5d.onrender.com/users/update",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Update failed" },
        { status: backendRes.status }
      );
    }

    // 3️⃣ Return backend response
    return NextResponse.json(data);

  } catch (err) {
    console.error("User update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}