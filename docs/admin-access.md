# Admin And Moderator Access

The current Redactie area is a local workflow prototype. It is not production security.

Current local behavior:

- `Redactie` is hidden from the public navigation unless local admin mode is active.
- Direct access to `#redactie` shows a local admin gate.
- The local gate stores `blind-democracy.admin-mode.v1` in `localStorage`.

Production target:

- Supabase Auth signs in admins and moderators.
- User roles are stored server-side.
- Supabase Row Level Security protects candidate data, source raw text, review logs, imports, and moderation actions.
- Public pages read only approved public tables.
- Client-side route checks remain UX only; database policies are the real boundary.

Suggested roles:

- `admin`: manages reviewers, imports, corrections, and publishing.
- `moderator`: reviews candidate positions and promise checks.
- `viewer`: can inspect admin data without mutating it.

Implemented schema scaffold:

- `supabase/migrations/202605050002_auth_roles_and_rls.sql`
- `public.user_roles`
- helper functions: `has_role`, `has_any_role`, `is_admin`, `can_review`, `can_view_admin`
- public read policies for approved/public data
- admin/mod policies for candidate data, source documents, extracted passages, review logs, Kamer votes, and promise checks

Bootstrap note:

Create the first Supabase Auth user manually, then insert its `auth.users.id` as `admin`.
See `supabase/seed/admin_roles.example.sql` for the shape. Do not run the example UUIDs unchanged.
