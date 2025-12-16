import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    // 1️⃣ Get Clerk token (App Router = await)
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Call backend
    const backendRes = await fetch(
      "https://docuback-pw5d.onrender.com/documents",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch documents" },
        { status: backendRes.status }
      );
    }

    // 3️⃣ Return backend response
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("Document list error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}