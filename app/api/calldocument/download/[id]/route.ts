import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔑 IMPORTANT: params is async in Next 15
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing document id" },
        { status: 400 }
      );
    }

    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendRes = await fetch(
      `https://docuback-pw5d.onrender.com/documents/${id}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(
        { error: data.error || "Download failed" },
        { status: backendRes.status }
      );
    }

    // Forward headers (Content-Type, Content-Disposition)
    const headers = new Headers(backendRes.headers);

    return new NextResponse(await backendRes.arrayBuffer(), {
      headers,
      status: 200,
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}