import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const clerkId = formData.get("clerkId") as string;

    if (!file || !clerkId) {
      return NextResponse.json({ error: "Missing file or user ID" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = file.name;
    const filePath = `${clerkId}/${Date.now()}-${fileName}`;

    // Convert file (File from Web API) to Buffer for Node.js
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, buffer, { upsert: true, contentType: file.type });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Insert metadata into Supabase table
    const { data: docData, error: dbError } = await supabase
      .from("documents")
      .insert([
        {
          clerk_id: clerkId,
          file_name: fileName,
          file_type: file.type,
          file_size: file.size,
          file_url: publicUrl,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ document: docData });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}