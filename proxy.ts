import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authCookieOptions, REMEMBER_COOKIE } from "@/lib/supabase/cookies";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

// Pages reachable while signed out.
const PUBLIC_PATHS = ["/admin/login", "/admin/lost-password", "/admin/auth/callback"];

// Refreshes the Supabase session cookie and bounces signed-out visitors to the login page.
// This is only an optimistic check; the admin layout and every server action verify admin rights.
export async function proxy(request: NextRequest) {
  const isPublic = PUBLIC_PATHS.includes(request.nextUrl.pathname);
  if (!isSupabaseConfigured) {
    return isPublic ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== "0";
  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, authCookieOptions(options, remember)),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublic) return NextResponse.redirect(new URL("/admin/login", request.url));
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
