import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // ✅ MUST await auth()
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const backendRes = await fetch(
      "https://docuback-pw5d.onrender.com/documents/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Upload failed" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}