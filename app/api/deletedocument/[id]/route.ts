import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ unwrap async params (REQUIRED in new Next.js)
  const { id } = await context.params;

  const authData = await auth();
  const token = await authData.getToken();

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const res = await fetch(
    `https://docuback-pw5d.onrender.com/documents/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: res.status }
    );
  }

  return NextResponse.json({ success: true });
}