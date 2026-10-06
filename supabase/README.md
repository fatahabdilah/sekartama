# Admin panel setup (Supabase)

The admin panel lives at `/admin`. Without Supabase configured, the site serves the built-in content from `lib/` and `/admin` shows a setup notice.

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run `migrations/0001_admin.sql`, `migrations/0002_secrets.sql`, `migrations/0003_chat_status.sql`, then `seed.sql`. The seed imports the current blog posts, products, projects, contact info, and chat settings, and is safe to re-run.
3. In **Authentication → Users**, click **Add user** and create the admin account (email + password).
   The `admin@sekartama-upvc.com` account already exists. It signs in with the username `admin`.
4. Back in **SQL Editor**, run `grant-admin.sql`. It confirms the account's email and grants admin access. Edit the email in it to grant another user.
5. In **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**. Only users in `public.admins` can edit anything, but there's no reason to allow sign-ups.
6. Copy **Project URL** and the **publishable** key from **Project Settings → API** into `.env.local` (and your hosting provider's env vars):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
7. Restart the dev server, or redeploy. `next.config.ts` reads the Supabase URL at build time to allow uploaded images.

Saving in the admin expires the cached content, so changes show on the next page load.

The Gemini API key is set in **Admin → Chat AI** and stored in `app_secrets`. Run `migrations/0002_secrets.sql` first. The public API can't read that table, and the chat route reads it with `SUPABASE_SECRET_KEY` (**Project Settings → API Keys → Secret keys**, server-only). `GEMINI_API_KEY` in env still works as a fallback. Never put secrets in the `settings` table, because that table is publicly readable.

To regenerate `seed.sql` after changing the built-in content in `lib/`: `node scripts/generate-seed.mts`.

## Password reset ("Lost your password?")

Supabase emails a reset link that returns to `/admin/auth/callback`. In **Authentication → URL Configuration**, set **Site URL** to the production domain and add `http://localhost:3000/**`, `http://localhost:3001/**` and `https://<your-domain>/**` to **Redirect URLs**. The default Supabase mailer only sends a few emails per hour; configure custom SMTP under **Authentication → Emails** for production.
