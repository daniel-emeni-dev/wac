/*
  WAC schema v1.1 patch. Run AFTER wac_schema_v1.sql, in the Supabase SQL editor.
  Fixes found in review of v1:
  1. Role guard blocked the SQL editor and service role (auth.uid() is null there), so you could not set the first leadership user.
  2. New auth users were never linked to their members row, so login would find no member.
  3. The anon role could read the leaderboard view (Supabase grants anon by default).
  4. Members could set fields on their own pending payment that only staff should set.
*/

/* 1. Allow role changes from the SQL editor and service role (no signed in user). */
create or replace function public.guard_member_role() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_leadership() then
    raise exception 'Only leadership can change roles';
  end if;
  return new;
end
$$;

/* 2. Link a new auth user to the member row with the same email. */
create or replace function public.link_auth_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.members
     set auth_user_id = new.id
   where lower(email) = lower(new.email)
     and auth_user_id is null;
  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.link_auth_user();

/* 3. Signed out visitors get nothing. Only the leaderboard is granted to signed in users. */
revoke all on all tables in schema public from anon;
revoke all on public.leaderboard from anon;
grant select on public.leaderboard to authenticated;

/* 4. Tighten the member insert policy on payments. */
drop policy if exists payments_member_insert on public.payments;
create policy payments_member_insert on public.payments for insert
  with check (
    member_id = public.current_member_id()
    and status = 'pending'
    and source = 'app'
    and verified_by is null
    and verified_at is null
    and rejected_reason is null
    and recorded_by is null
  );
