import { createClient } from "@supabase/supabase-js";
import { CONTENT_TAG, supabaseAnonKey, supabaseUrl } from "./env";

const CONTENT_REVALIDATE_SECONDS = 300;

// Anonymous client for public pages. Responses are cached under CONTENT_TAG and expired by admin saves
// (updateTag). Tag invalidations live in server memory, so a restarted server — or a change made directly in
// Supabase — would otherwise keep serving the disk cache; the 5-minute revalidate bounds that staleness.
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: CONTENT_REVALIDATE_SECONDS, tags: [CONTENT_TAG] } }),
    },
  });
}
