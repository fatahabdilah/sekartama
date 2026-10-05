import type { Metadata } from "next";
import LoginLogo from "@/components/admin/wp/LoginLogo";
import LostPasswordForm from "@/components/admin/wp/LostPasswordForm";

export const metadata: Metadata = { title: { absolute: "Lost Password ‹ Sekar Tama UPVC" } };

export default function LostPasswordPage() {
  return (
    <>
      <h1 className="screen-reader-text">Lost Password</h1>
      <div id="login">
        <LoginLogo />
        <LostPasswordForm />
        <p id="nav">
          <a className="wp-login-log-in" href="/admin/login">
            Log in
          </a>
        </p>
        <p id="backtoblog">
          <a href="/">&larr; Go to Sekar Tama UPVC</a>
        </p>
      </div>
    </>
  );
}
