import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAuthClient } from "@/lib/supabase/server";

/** Returns an authenticated Supabase client, or redirects when the visitor isn't a listed admin. */
export async function requireAdmin() {
  await connection(); // per-request auth: never prerender admin pages
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin/login?error=not_admin");
  return { supabase, user };
}
