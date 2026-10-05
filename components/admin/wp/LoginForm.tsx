"use client";

import { useActionState } from "react";
import { signIn, type LoginError, type LoginState } from "@/app/admin/actions";
import PasswordInput from "./PasswordInput";

const LOST = (
  <a href="/admin/lost-password" key="lost">
    Lost your password?
  </a>
);

function errorMessage(code: LoginError, login: string) {
  switch (code) {
    case "empty_username":
      return <>The username field is empty.</>;
    case "empty_password":
      return <>The password field is empty.</>;
    case "invalid":
      return (
        <>
          The password you entered for the username <strong>{login}</strong> is incorrect. {LOST}
        </>
      );
    case "not_confirmed":
      return <>This account has not been activated yet. Run supabase/grant-admin.sql in the Supabase SQL Editor.</>;
    case "not_admin":
      return <>Sorry, you are not allowed to access this page.</>;
    case "no_tables":
      return <>The admin tables are missing. Run supabase/migrations/0001_admin.sql in the Supabase SQL Editor.</>;
    case "not_configured":
      return <>Supabase is not configured. Set the Supabase URL and publishable key in .env.local.</>;
    case "rate_limited":
      return <>Too many login attempts. Please try again in a few minutes.</>;
  }
}

export default function LoginForm({ notice }: { notice?: React.ReactNode }) {
  // `attempt` remounts the form after each failed try so WordPress's shake animation replays.
  const [state, formAction, pending] = useActionState<LoginState & { attempt?: number }, FormData>(
    async (prev, formData) => ({ ...(await signIn(prev, formData)), attempt: (prev.attempt ?? 0) + 1 }),
    {},
  );

  return (
    <>
      {state.code ? (
        <div id="login_error" className="notice notice-error">
          <p>
            <strong>Error:</strong> {errorMessage(state.code, state.login ?? "")}
          </p>
        </div>
      ) : (
        notice
      )}
      <form name="loginform" id="loginform" action={formAction} className={state.code ? "shake" : undefined} key={state.attempt}>
        <p>
          <label htmlFor="user_login">Username or Email Address</label>
          <input
            type="text"
            name="log"
            id="user_login"
            className="input"
            defaultValue={state.login ?? ""}
            size={20}
            autoCapitalize="off"
            autoComplete="username"
            required
            autoFocus
          />
        </p>

        <div className="user-pass-wrap">
          <label htmlFor="user_pass">Password</label>
          <PasswordInput id="user_pass" name="pwd" autoComplete="current-password" />
        </div>
        <p className="forgetmenot">
          <input name="rememberme" type="checkbox" id="rememberme" value="forever" /> <label htmlFor="rememberme">Remember Me</label>
        </p>
        <p className="submit">
          <input
            type="submit"
            name="wp-submit"
            id="wp-submit"
            className="button button-primary button-large"
            value="Log In"
            disabled={pending}
          />
        </p>
      </form>
    </>
  );
}
