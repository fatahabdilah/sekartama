import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authCookieOptions, REMEMBER_COOKIE } from "./cookies";
import { supabaseAnonKey, supabaseUrl } from "./env";

// Cookie-authenticated client for the admin panel (server components, server actions, route handlers).
export async function createAuthClient({ remember }: { remember?: boolean } = {}) {
  const cookieStore = await cookies();
  const keepSignedIn = remember ?? cookieStore.get(REMEMBER_COOKIE)?.value !== "0";
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, authCookieOptions(options, keepSignedIn)),
          );
        } catch {
          // Called from a Server Component, where cookies are read-only; proxy.ts refreshes the session.
        }
      },
    },
  });
}
