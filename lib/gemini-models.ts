export type GeminiModel = { id: string; name: string };

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

// Used when the model list can't be fetched (no key yet, or the API is unreachable).
const FALLBACK: GeminiModel[] = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "gemini-flash-latest", name: "Gemini Flash Latest" },
  { id: "gemini-pro-latest", name: "Gemini Pro Latest" },
];

// Models that generate text but aren't meant for a chat assistant.
const NOT_FOR_CHAT = /tts|image|robotics|computer-use|transcribe|customtools|embedding|aqa/;

/** Chat-capable Gemini/Gemma models available to this API key, cached for a day. */
export async function listGeminiModels(apiKey: string): Promise<GeminiModel[]> {
  if (!apiKey) return FALLBACK;
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", {
      headers: { "x-goog-api-key": apiKey },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as {
      models?: { name: string; displayName?: string; supportedGenerationMethods?: string[] }[];
    };
    const models = (data.models ?? [])
      .map((m) => ({ id: m.name.replace(/^models\//, ""), name: m.displayName ?? m.name, methods: m.supportedGenerationMethods ?? [] }))
      .filter((m) => m.methods.includes("generateContent") && /^(gemini|gemma)-/.test(m.id) && !NOT_FOR_CHAT.test(m.id))
      .map(({ id, name }) => ({ id, name }));
    return models.length ? models : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
