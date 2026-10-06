import { buildSystemPrompt } from "@/lib/assistant";
import { getChatConfig, getContact, getProductCategories, getProjects } from "@/lib/data";
import { DEFAULT_GEMINI_MODEL } from "@/lib/gemini-models";
import { generateReply, reportChatStatus, type ChatMessage } from "@/lib/gemini";
import { getGeminiApiKey } from "@/lib/secrets";


const MAX_MESSAGES = 20;
const MAX_CHARS = 1000;
const RATE_LIMIT = 20; // requests per IP per window
const RATE_WINDOW_MS = 60_000;

// Best-effort, per-instance limiter to keep the API key from being abused.
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  const valid = (messages as Partial<ChatMessage>[]).every(
    (m) =>
      (m?.role === "user" || m?.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0 &&
      m.content.length <= MAX_CHARS,
  );
  return valid && messages.at(-1).role === "user" ? (messages as ChatMessage[]) : null;
}

export async function POST(request: Request) {
  const [apiKey, config, categories, projects, contact] = await Promise.all([
    getGeminiApiKey(),
    getChatConfig(),
    getProductCategories(),
    getProjects(),
    getContact(),
  ]);
  if (!apiKey || !config.enabled) return Response.json({ error: "not_configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const messages = parseMessages(await request.json().catch(() => null));
  if (!messages) return Response.json({ error: "invalid_request" }, { status: 400 });

  const result = await generateReply({
    apiKey,
    model: config.model || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL,
    systemPrompt: buildSystemPrompt(config, categories, projects, contact),
    temperature: config.temperature,
    messages,
  });

  if ("reply" in result) {
    await reportChatStatus("ok");
    return Response.json({ reply: result.reply });
  }
  await reportChatStatus(result.status, result.detail);
  return Response.json({ error: "upstream_error" }, { status: 502 });
}
