import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const BACKEND_URL = "http://127.0.0.1:4000";

export async function GET() {
  try {
    // 1️⃣ Clerk auth
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Call backend documents API
    const backendRes = await fetch(
      `${BACKEND_URL}/documents`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // always fresh
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch documents" },
        { status: backendRes.status }
      );
    }

    /**
     * 🔑 Normalize response shape
     * Backend may return:
     *  - { documents: [...] }
     *  - or directly [...]
     */
    const documents = Array.isArray(data)
      ? data
      : data.documents ?? [];

    return NextResponse.json({ documents });

  } catch (err) {
    console.error("Documents fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}