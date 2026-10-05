import { createServiceClient, isServiceConfigured } from "@/lib/supabase/service";

export const GEMINI_KEY = "gemini_api_key";

/** The Gemini key saved in the admin panel, falling back to the GEMINI_API_KEY env var. */
export async function getGeminiApiKey() {
  if (isServiceConfigured) {
    const { data, error } = await createServiceClient()
      .from("app_secrets")
      .select("value")
      .eq("key", GEMINI_KEY)
      .maybeSingle();
    if (error) console.error("getGeminiApiKey", error.message);
    if (data?.value) return data.value as string;
  }
  return process.env.GEMINI_API_KEY ?? "";
}
