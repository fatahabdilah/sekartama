import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

// Supabase "secret" key (or the legacy service_role key). Server-only: never prefix with NEXT_PUBLIC_.
const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServiceConfigured = Boolean(supabaseUrl && secretKey);

/** Bypasses RLS. Only for reading server-only data such as app_secrets; never expose results to the client. */
export function createServiceClient() {
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
