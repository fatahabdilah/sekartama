import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginLogo from "@/components/admin/wp/LoginLogo";
import ResetPasswordForm from "@/components/admin/wp/ResetPasswordForm";
import { createAuthClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { absolute: "Reset Password ‹ Sekar Tama UPVC" } };

// Reached from the emailed reset link, after /admin/auth/callback has signed the user in.
export default async function ResetPasswordPage() {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <h1 className="screen-reader-text">Reset Password</h1>
      <div id="login">
        <LoginLogo />
        <ResetPasswordForm />
        <p id="nav">
          <a href="/admin/login">Log in</a>
        </p>
        <p id="backtoblog">
          <a href="/">&larr; Go to Sekar Tama UPVC</a>
        </p>
      </div>
    </>
  );
}
