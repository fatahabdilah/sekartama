"use client";

import { useState } from "react";

type Props = { id: string; name: string; autoComplete: string; defaultValue?: string; className?: string };

/** WordPress's password field with the show/hide eye button (.wp-pwd). */
export default function PasswordInput({ id, name, autoComplete, defaultValue, className = "input password-input" }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="wp-pwd">
      <input
        type={visible ? "text" : "password"}
        name={name}
        id={id}
        className={className}
        defaultValue={defaultValue}
        size={20}
        autoComplete={autoComplete}
        spellCheck={false}
        required
      />
      <button
        type="button"
        className="button button-secondary wp-hide-pw hide-if-no-js"
        data-toggle={visible ? 1 : 0}
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
      >
        <span className={`dashicons ${visible ? "dashicons-hidden" : "dashicons-visibility"}`} aria-hidden="true" />
      </button>
    </div>
  );
}
