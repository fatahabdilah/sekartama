import type { Metadata } from "next";
import LoginForm from "@/components/admin/wp/LoginForm";
import LoginLogo from "@/components/admin/wp/LoginLogo";

export const metadata: Metadata = { title: { absolute: "Log In ‹ Sekar Tama UPVC" } };

type Props = { searchParams: Promise<{ loggedout?: string; checkemail?: string; password?: string; error?: string }> };

function Message({ children }: { children: React.ReactNode }) {
  return (
    <div id="login-message" className="notice notice-info message">
      <p>{children}</p>
    </div>
  );
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const notice = params.error === "expired" ? (
    <div id="login_error" className="notice notice-error">
      <p>
        <strong>Error:</strong> Your password reset link appears to be invalid. Please request a new link below.
      </p>
    </div>
  ) : params.error === "not_admin" ? (
    <div id="login_error" className="notice notice-error">
      <p>
        <strong>Error:</strong> Sorry, you are not allowed to access this page.
      </p>
    </div>
  ) : params.checkemail ? (
    <Message>Check your email for the confirmation link, then visit the login page.</Message>
  ) : params.password === "changed" ? (
    <Message>Your password has been reset.</Message>
  ) : params.loggedout ? (
    <Message>You are now logged out.</Message>
  ) : null;

  return (
    <>
      <h1 className="screen-reader-text">Log In</h1>
      <div id="login">
        <LoginLogo />
        <LoginForm notice={notice} />
        <p id="nav">
          <a className="wp-login-lost-password" href="/admin/lost-password">
            Lost your password?
          </a>
        </p>
        <p id="backtoblog">
          <a href="/">&larr; Go to Sekar Tama UPVC</a>
        </p>
      </div>
    </>
  );
}
