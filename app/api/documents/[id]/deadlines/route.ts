import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface Props {
  params: { id: string } | Promise<{ id: string }>;
}

export async function GET(req: Request, context: Props) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing document id" },
        { status: 400 }
      );
    }

    // 🔹 Get Clerk auth token
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔹 Call backend deadlines API
    const backendRes = await fetch(
      `http://127.0.0.1:4000/documents/${id}/deadlines`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // important for fresh data
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch deadlines" },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      deadlines: data.deadlines ?? [],
    });
  } catch (err) {
    console.error("Deadlines fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




export async function PUT(req: Request, context: Props) {
  // ✅ Resolve params safely (handles Promise + non-Promise)
  const { id } = await context.params;

  const authData = await auth();
  const token = await authData.getToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();

  const backendRes = await fetch(
    `http://127.0.0.1:4000/deadlines/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await backendRes.json();

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: data.error || 'Update failed' },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ deadline: data.deadline });
}

export async function DELETE(req: Request, context: Props) {
  const { id } = await context.params;

  const authData = await auth();
  const token = await authData.getToken();

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const backendRes = await fetch(
    `http://127.0.0.1:4000/deadlines/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!backendRes.ok) {
    const data = await backendRes.json();
    return NextResponse.json(
      { error: data.error || 'Delete failed' },
      { status: backendRes.status }
    );
  }

  return NextResponse.json({ success: true });
}