import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

// The admin bar's "Log Out" link (wp-login.php?action=logout).
export async function GET(request: NextRequest) {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login?loggedout=true", request.url));
}
