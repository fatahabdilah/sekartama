-- Activates the admin account created via sign-up (skips the confirmation email) and grants admin access.
-- Run after migrations/0001_admin.sql. Change the email to grant another user.
update auth.users
set email_confirmed_at = coalesce(email_confirmed_at, now())
where email = 'admin@sekartama-upvc.com';

insert into public.admins (user_id)
select id from auth.users where email = 'admin@sekartama-upvc.com'
on conflict (user_id) do nothing;
