-- Last known health of the chat assistant, so the admin can see when the Gemini quota runs out.
-- The public chat route reports through record_chat_status(); only admins can read the row.
create table if not exists public.chat_status (
  id int primary key default 1 check (id = 1),
  status text not null,
  detail text not null default '',
  last_ok_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.chat_status enable row level security;
revoke all on public.chat_status from anon, authenticated;
grant select on public.chat_status to authenticated;

drop policy if exists "admins read chat status" on public.chat_status;
create policy "admins read chat status" on public.chat_status for select using (public.is_admin());

-- Callable by the anonymous chat route; accepts only known statuses and a short detail.
create or replace function public.record_chat_status(p_status text, p_detail text default '')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('ok', 'quota', 'invalid_key', 'error') then
    raise exception 'invalid status';
  end if;
  insert into public.chat_status (id, status, detail, last_ok_at, updated_at)
  values (1, p_status, left(coalesce(p_detail, ''), 300), case when p_status = 'ok' then now() end, now())
  on conflict (id) do update set
    status = excluded.status,
    detail = excluded.detail,
    last_ok_at = coalesce(excluded.last_ok_at, public.chat_status.last_ok_at),
    updated_at = now();
end;
$$;

revoke all on function public.record_chat_status(text, text) from public;
grant execute on function public.record_chat_status(text, text) to anon, authenticated;
