import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
  try {
    const authData = await auth();
    const token = await authData.getToken();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing notification id" }, { status: 400 });
    }

    const res = await fetch(
      `http://127.0.0.1:4000/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to mark notification read" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}