import { createServerSupabaseClient } from "@next-inflearn/supabase";
import { NextResponse } from "next/server";

// localhost:3003/auth/?code=...
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // localhost:3003/
  return NextResponse.redirect(requestUrl.origin);
}
