import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // ✅ MUST await auth()
  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ use supabase template if configured, otherwise remove template option
  const token = await getToken({ template: "supabase" });

  if (!token) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const backendRes = await fetch(
    `https://docuback-pw5d.onrender.com/entities/${params.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: data.error || "Delete failed" },
      { status: backendRes.status }
    );
  }

  return NextResponse.json(data);
}


export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const { getToken } = await auth();
  const token = await getToken(); // 🔥 NO template unless backend expects it

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(
    `https://docuback-pw5d.onrender.com/entities/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ THIS FIXES THE WARNING
      },
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: data.error || "Failed to fetch entity" },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ entity: data.entity });
}