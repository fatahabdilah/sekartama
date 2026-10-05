import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

// Landing point for links Supabase emails (password reset): trades the one-time code for a session.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next");
  const destination = next?.startsWith("/admin/") ? next : "/admin";

  if (code) {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(destination, request.url));
  }
  return NextResponse.redirect(new URL("/admin/login?error=expired", request.url));
}
