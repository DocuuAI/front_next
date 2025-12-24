export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authData = await auth();
  const token = await authData.getToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const entityId = formData.get("entity_id") as string;

  if (!file) {
    return NextResponse.json({ error: "File missing" }, { status: 400 });
  }

  if (!entityId) {
    return NextResponse.json({ error: "entity_id is required" }, { status: 400 });
  }

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("entity_id", entityId);

  const res = await fetch("http://127.0.0.1:4000/documents/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // DO NOT set Content-Type here
    },
    body: uploadForm,
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}