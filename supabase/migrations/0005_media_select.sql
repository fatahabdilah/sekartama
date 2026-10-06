-- Storage needs a SELECT policy to list, overwrite, or delete objects; reading files publicly goes through the
-- public bucket URL and doesn't depend on this. Only admins can see the object rows.
drop policy if exists "admin read media" on storage.objects;
create policy "admin read media" on storage.objects for select
  using (bucket_id = 'media' and public.is_admin());
