import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export type ChatStatus = "ok" | "quota" | "invalid_key" | "error";
export type ChatMessage = { role: "user" | "assistant"; content: string };

type Request = { apiKey: string; model: string; systemPrompt: string; temperature: number; messages: ChatMessage[] };
type Result = { reply: string } | { status: Exclude<ChatStatus, "ok">; detail: string };

function classify(httpStatus: number): Exclude<ChatStatus, "ok"> {
  if (httpStatus === 429) return "quota";
  if (httpStatus === 400 || httpStatus === 401 || httpStatus === 403) return "invalid_key";
  return "error";
}

/** One Gemini generateContent call, with failures classified for the admin's chat status. */
export async function generateReply({ apiKey, model, systemPrompt, temperature, messages }: Request): Promise<Result> {
  // Gemini expects the conversation to open with a user turn.
  const firstUser = messages.findIndex((m) => m.role === "user");
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.slice(firstUser).map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature, maxOutputTokens: 1024 },
      }),
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Gemini error", res.status, body);
      const message = (() => {
        try {
          return (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? "";
        } catch {
          return "";
        }
      })();
      // A 400 is only a key problem when Google says so; otherwise it's a request/model error.
      const status = res.status === 400 && !/api key/i.test(message) ? "error" : classify(res.status);
      return { status, detail: `HTTP ${res.status}${message ? `: ${message}` : ""}` };
    }

    const data = await res.json();
    const reply: string | undefined = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("")
      .trim();
    return reply ? { reply } : { status: "error", detail: "Gemini returned an empty reply." };
  } catch (error) {
    console.error("Gemini request failed", error);
    return { status: "error", detail: error instanceof Error ? error.message : "Request failed." };
  }
}

// Per-instance memory so a busy chat doesn't write the same status on every message.
let lastReported: ChatStatus | null = null;

/** Records the chat's health for the admin panel (Dashboard and Chat AI notices). Never throws. */
export async function reportChatStatus(status: ChatStatus, detail = "", { force = false } = {}) {
  if (!isSupabaseConfigured || (!force && status === lastReported)) return;
  lastReported = status;
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
    const { error } = await client.rpc("record_chat_status", { p_status: status, p_detail: detail });
    if (error) console.error("reportChatStatus", error.message);
  } catch (error) {
    console.error("reportChatStatus", error);
  }
}
