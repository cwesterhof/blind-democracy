-- Example only. Replace the UUIDs with real auth.users.id values after creating users in Supabase Auth.
-- Do not run this file unchanged.

insert into public.user_roles (user_id, role)
values
  ('00000000-0000-0000-0000-000000000000', 'admin'),
  ('11111111-1111-1111-1111-111111111111', 'moderator')
on conflict (user_id, role) do nothing;

