import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface Props {
  params: { id: string };
}

export async function GET(req: Request, context: Props) {
  try {
    // 🔹 Unwrap params safely
    const params = await context.params; // ensure it's resolved
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

    // 🔹 Fetch entities from backend
    const backendRes = await fetch(
      `http://127.0.0.1:4000/documents/${id}/entities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch entities" },
        { status: backendRes.status }
      );
    }

    // 🔹 Return entities array (fallback to empty array)
    return NextResponse.json({ entities: data.entities ?? [] });
  } catch (err) {
    console.error("Entities fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}