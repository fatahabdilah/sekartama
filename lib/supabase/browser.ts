import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "./env";

// Used by the admin image uploader; the session cookie authorizes writes to the media bucket.
export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
