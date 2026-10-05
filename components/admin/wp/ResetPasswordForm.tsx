"use client";

import { useActionState, useEffect, useRef } from "react";
import { resetPassword, type FormState } from "@/app/admin/actions";

function generatePassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()";
  const bytes = crypto.getRandomValues(new Uint32Array(24));
  return Array.from(bytes, (n) => chars[n % chars.length]).join("");
}

export default function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(resetPassword, {});
  const input = useRef<HTMLInputElement>(null);

  // Generated on the client only, so server and client markup match.
  useEffect(() => {
    if (input.current && !input.current.value) input.current.value = generatePassword();
  }, []);

  return (
    <>
      {state.error ? (
        <div id="login_error" className="notice notice-error">
          <p>
            <strong>Error:</strong> {state.error}
          </p>
        </div>
      ) : (
        <div className="notice notice-info message reset-pass">
          <p>Enter your new password below or generate one.</p>
        </div>
      )}
      <form name="resetpassform" id="resetpassform" action={formAction} autoComplete="off">
        <div className="user-pass1-wrap">
          <p>
            <label htmlFor="pass1">New password</label>
          </p>
          <div className="wp-pwd">
            <input
              ref={input}
              type="text"
              name="pass1"
              id="pass1"
              className="input password-input"
              size={24}
              autoComplete="new-password"
              spellCheck={false}
              required
            />
          </div>
        </div>
        <p className="description indicator-hint">
          Hint: The password should be at least twelve characters long. To make it stronger, use upper and lower case
          letters, numbers, and symbols like ! &quot; ? $ % ^ &amp; ).
        </p>
        <br className="clear" />
        <p className="submit reset-pass-submit">
          <button
            type="button"
            className="button wp-generate-pw hide-if-no-js skip-aria-expanded"
            onClick={() => {
              if (input.current) input.current.value = generatePassword();
            }}
          >
            Generate Password
          </button>
          <input
            type="submit"
            name="wp-submit"
            id="wp-submit"
            className="button button-primary button-large"
            value="Save Password"
            disabled={pending}
          />
        </p>
      </form>
    </>
  );
}
