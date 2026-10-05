"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// The bar (and its WordPress CSS) is only downloaded for signed-in admins.
const SiteAdminBar = dynamic(() => import("./SiteAdminBar"), { ssr: false });

/** Shows the WordPress admin bar on the public site when an admin is signed in, like WordPress does. */
export default function AdminBarLoader() {
  const [admin, setAdmin] = useState<string | null>(null);

  useEffect(() => {
    // Visitors without a Supabase session cookie never hit the auth API.
    if (!isSupabaseConfigured || !document.cookie.includes("-auth-token")) return;
    const supabase = createBrowserSupabase();
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
      if (data && !cancelled) setAdmin(user.email?.split("@")[0] ?? "admin");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return admin ? <SiteAdminBar displayName={admin} /> : null;
}
