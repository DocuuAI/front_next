import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

type Params = {
  id: string;
};

/* ---------------- GET ENTITY ---------------- */
export async function GET(
  _req: Request,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(
    `https://docuback-pw5d.onrender.com/entities/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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

/* ---------------- DELETE ENTITY ---------------- */
export async function DELETE(
  _req: Request,
  context: { params: Promise<Params> }
) {
  const { id } = await context.params;

  const { userId, getToken } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendRes = await fetch(
    `https://docuback-pw5d.onrender.com/entities/${id}`,
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

  return NextResponse.json({ success: true });
}