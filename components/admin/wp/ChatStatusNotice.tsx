import Link from "next/link";
import { longDateTime } from "@/lib/admin-format";
import type { createAuthClient } from "@/lib/supabase/server";

type Props = { supabase: Awaited<ReturnType<typeof createAuthClient>>; showOk?: boolean };

type Row = { status: string; detail: string; last_ok_at: string | null; updated_at: string };

/** Warns when the public chat's last Gemini call failed (quota, rejected key, other errors). */
export default async function ChatStatusNotice({ supabase, showOk }: Props) {
  const { data } = await supabase.from("chat_status").select("*").maybeSingle<Row>();
  if (!data) return null;

  const since = `since ${longDateTime(data.updated_at)}`;
  const lastOk = data.last_ok_at ? ` Last successful reply: ${longDateTime(data.last_ok_at)}.` : "";
  const link = <Link href="/admin/chat">Chat AI Settings</Link>;

  if (data.status === "ok") {
    return showOk ? (
      <div className="notice notice-success inline">
        <p>The chat assistant is working. Last successful reply: {longDateTime(data.last_ok_at ?? data.updated_at)}.</p>
      </div>
    ) : null;
  }

  const message =
    data.status === "quota" ? (
      <>
        <strong>Chat AI quota exhausted</strong> {since} — visitors are being sent to WhatsApp instead. The free tier
        resets daily; to restore it sooner, pick a lighter model or add a key from another Google project in {link}, or
        enable billing in Google AI Studio.
      </>
    ) : data.status === "invalid_key" ? (
      <>
        <strong>The Gemini API key was rejected</strong> {since} — visitors are being sent to WhatsApp instead. Enter a
        valid key in {link}.
      </>
    ) : (
      <>
        <strong>Chat AI is failing</strong> {since} — visitors are being sent to WhatsApp instead. Check {link}.
      </>
    );

  return (
    <div className={`notice ${data.status === "quota" ? "notice-warning" : "notice-error"}`}>
      <p>
        {message}
        {lastOk}
      </p>
      {data.detail && (
        <p>
          <code>{data.detail}</code>
        </p>
      )}
    </div>
  );
}
