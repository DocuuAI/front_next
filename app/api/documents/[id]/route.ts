import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface Props {
  params: { id: string };
}

export async function GET(req: Request, context: Props) {
  try {
    const params = await context.params; // ensure params is resolved
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing document id" },
        { status: 400 }
      );
    }

    // 🔹 Get Clerk token
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Fetch from backend
    const backendRes = await fetch(`http://127.0.0.1:4000/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch document" },
        { status: backendRes.status }
      );
    }

    // 🔹 Return processing_status safely
    return NextResponse.json({ processing_status: data.processing_status ?? null });
  } catch (err) {
    console.error("Document fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}