import type { CookieOptions } from "@supabase/ssr";

/** "0" when the admin signed in without "Remember Me": auth cookies then last only for the browser session. */
export const REMEMBER_COOKIE = "sekar_remember";

export function authCookieOptions(options: CookieOptions, remember: boolean): CookieOptions {
  if (remember) return options;
  const { maxAge: _maxAge, expires: _expires, ...sessionOnly } = options;
  return sessionOnly;
}
