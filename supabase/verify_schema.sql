/* Run after the schema and patch. Every row should show ok = true. */
select 'tables exist' as check_name,
       (select count(*) from information_schema.tables
         where table_schema = 'public'
           and table_name in ('members','member_private','settings','payments','payment_adjustments','notices','audit_log')) = 7 as ok
union all
select 'rls on for all 7',
       (select count(*) from pg_tables
         where schemaname = 'public' and rowsecurity
           and tablename in ('members','member_private','settings','payments','payment_adjustments','notices','audit_log')) = 7
union all
select 'settings seeded', (select count(*) from public.settings) = 7
union all
select 'leaderboard view exists',
       exists (select 1 from information_schema.views where table_schema = 'public' and table_name = 'leaderboard')
union all
select 'auth link trigger exists',
       exists (select 1 from pg_trigger where tgname = 'on_auth_user_created')
union all
select 'anon cannot read leaderboard',
       not has_table_privilege('anon', 'public.leaderboard', 'select');
