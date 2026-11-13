/*
  Bootstrap the first leadership user. Use FAKE data while building.
  Order matters:
  1. In Supabase, Authentication, Users, "Add user", with the email below and a password.
  2. Run this. If the member row already exists (after the import), skip the insert and run only the update.
*/
insert into public.members (member_code, full_name, email, join_month, status, role)
values ('WAC-TEST-LEAD', 'Test Leader', 'leader@example.com', date '2026-10-01', 'active', 'leadership')
on conflict (email) do nothing;

/* Link the auth user created in step 1 (the signup trigger only fires for users created after the patch). */
update public.members m
   set auth_user_id = u.id
  from auth.users u
 where lower(u.email) = lower(m.email)
   and m.auth_user_id is null;

/* Later, for the real leadership person, once the import is done:
   update public.members set role = 'leadership' where member_code = 'WAC-XXX';  */
