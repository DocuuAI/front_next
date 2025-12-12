import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // server-side service_role key

interface UpdateUserRequest {
  clerkId: string;
  pan: string;
}

export async function POST(req: Request) {
  const { clerkId, pan }: UpdateUserRequest = await req.json();

  if (!clerkId || !pan || pan.length !== 10) {
    return NextResponse.json({ data: null, error: "Invalid input" }, { status: 400 });
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan)) {
    return NextResponse.json({ data: null, error: "Invalid PAN format" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .update({ pan })
    .eq("clerk_id", clerkId)
    .select()
    .single();

  return NextResponse.json({ data, error });
}