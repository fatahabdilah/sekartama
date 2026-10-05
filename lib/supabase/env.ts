export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
// Supabase's newer "publishable" key and the legacy "anon" key are interchangeable here.
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Without these the site serves the built-in content and the admin panel is disabled. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const MEDIA_BUCKET = "media";

/** Cache tag on every public content read; admin saves expire it. */
export const CONTENT_TAG = "content";
