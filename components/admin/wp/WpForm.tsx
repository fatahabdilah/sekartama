"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/admin/actions";

type NoticeProps = { type: "success" | "error"; children: React.ReactNode; settings?: boolean };

/** A dismissible admin notice (.notice.is-dismissible). */
export function Notice({ type, children, settings }: NoticeProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      id={settings ? "setting-error-settings_updated" : "message"}
      className={`notice notice-${type} ${settings ? "settings-error " : ""}is-dismissible`}
    >
      <p>{settings ? <strong>{children}</strong> : children}</p>
      <button type="button" className="notice-dismiss" onClick={() => setDismissed(true)}>
        <span className="screen-reader-text">Dismiss this notice.</span>
      </button>
    </div>
  );
}

type Props = {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  id?: string;
  name?: string;
  className?: string;
  /** Message carried in the URL after a redirect (e.g. "Post published."), shown until the next save. */
  initialMessage?: React.ReactNode;
  /** Settings pages wrap notices in <strong> like options.php does. */
  settings?: boolean;
  children: React.ReactNode;
};

/** A form whose server action result is shown as a WordPress notice at the top. */
export default function WpForm({ action, id, name, className, initialMessage, settings, children }: Props) {
  const [state, formAction] = useActionState<FormState & { attempt?: number }, FormData>(
    async (prev, formData) => ({
      ...(await action(prev, formData)),
      attempt: (prev.attempt ?? 0) + 1,
    }),
    {},
  );

  return (
    <form action={formAction} id={id} name={name} className={className}>
      {state.error ? (
        <Notice key={state.attempt} type="error" settings={settings}>
          {state.error}
        </Notice>
      ) : state.message ? (
        <Notice key={state.attempt} type="success" settings={settings}>
          {state.message}
        </Notice>
      ) : (
        initialMessage && <Notice type="success">{initialMessage}</Notice>
      )}
      {children}
    </form>
  );
}
