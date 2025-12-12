import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const clerkId = formData.get("clerkId") as string;

  if (!file || !clerkId) {
    return NextResponse.json({ error: "Missing file or user ID" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${clerkId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true, contentType: file.type });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const imageUrl = data.publicUrl;

  // Update user table
  const { error: dbError } = await supabase
    .from("users")
    .update({ avatar_url: imageUrl })
    .eq("clerk_id", clerkId);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ imageUrl });
}
