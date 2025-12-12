import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const { data, error } = await supabase.from("documents").select("*").limit(1);

  if (error) {
    return Response.json({
      connected: false,
      error: error.message,
    });
  }

  return Response.json({
    connected: true,
    message: "Supabase connection works",
    sample: data,
  });
}