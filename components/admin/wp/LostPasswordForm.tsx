"use client";

import { useActionState } from "react";
import { requestPasswordReset, type FormState } from "@/app/admin/actions";

export default function LostPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(requestPasswordReset, {});
  return (
    <>
      {state.error ? (
        <div id="login_error" className="notice notice-error">
          <p>
            <strong>Error:</strong> {state.error}
          </p>
        </div>
      ) : (
        <div className="notice notice-info message">
          <p>
            Please enter your username or email address. You will receive an email message with instructions on how
            to reset your password.
          </p>
        </div>
      )}
      <form name="lostpasswordform" id="lostpasswordform" action={formAction}>
        <p>
          <label htmlFor="user_login">Username or Email Address</label>
          <input
            type="text"
            name="user_login"
            id="user_login"
            className="input"
            size={20}
            autoCapitalize="off"
            autoComplete="username"
            required
            autoFocus
          />
        </p>
        <p className="submit">
          <input
            type="submit"
            name="wp-submit"
            id="wp-submit"
            className="button button-primary button-large"
            value="Get New Password"
            disabled={pending}
          />
        </p>
      </form>
    </>
  );
}
