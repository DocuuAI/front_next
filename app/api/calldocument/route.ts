import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { clerk_id } = await req.json();

    if (!clerk_id) {
      return NextResponse.json({ error: "Missing clerk_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("documents")
      .select("id, file_name, file_url, size_mb, document_type")
      .eq("clerk_id", clerk_id)
      .order("id", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ documents: data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
