-- Server-only secrets managed from the admin panel (e.g. the Gemini API key).
-- RLS is on with no policies, so the public API can't read or write this table at all.
-- Admins write through set_secret(); the server reads with the Supabase secret key (bypasses RLS).
create table if not exists public.app_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_secrets enable row level security;
revoke all on public.app_secrets from anon, authenticated;

create or replace function public.set_secret(p_key text, p_value text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if p_value is null or p_value = '' then
    delete from public.app_secrets where key = p_key;
  else
    insert into public.app_secrets (key, value, updated_at) values (p_key, p_value, now())
    on conflict (key) do update set value = excluded.value, updated_at = now();
  end if;
end;
$$;

-- Lets the admin UI show whether a secret is set without ever returning its value.
create or replace function public.secret_status()
returns table (key text, last4 text, updated_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select s.key, right(s.value, 4), s.updated_at
  from public.app_secrets s
  where public.is_admin();
$$;

revoke all on function public.set_secret(text, text) from public, anon;
revoke all on function public.secret_status() from public, anon;
grant execute on function public.set_secret(text, text) to authenticated;
grant execute on function public.secret_status() to authenticated;
