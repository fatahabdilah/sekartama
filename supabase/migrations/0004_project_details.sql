-- Project detail shown in the popup on /proyek: completion date and a short description.
alter table public.projects add column if not exists date date;
alter table public.projects add column if not exists description text not null default '';
