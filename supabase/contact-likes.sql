-- Run once in the Supabase SQL editor. All access is through the server-only RPC.
begin;
create table if not exists public.contact_likes (
  visitor_id uuid primary key,
  created_at timestamptz not null default now()
);
create table if not exists public.contact_like_total (
  id boolean primary key default true check (id),
  total bigint not null default 0 check (total >= 0)
);
insert into public.contact_like_total (id, total)
select true, count(*) from public.contact_likes on conflict (id) do nothing;
create table if not exists public.contact_like_limits (
  key text primary key,
  window_start timestamptz not null,
  requests integer not null
);
create index if not exists contact_like_limits_expiry on public.contact_like_limits (window_start);
alter table public.contact_likes enable row level security;
alter table public.contact_like_total enable row level security;
alter table public.contact_like_limits enable row level security;
revoke all on public.contact_likes, public.contact_like_total, public.contact_like_limits from anon, authenticated;

create or replace function public.contact_like(visitor_id uuid, add_like boolean, rate_key text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  requests integer;
  inserted integer;
  total bigint;
  liked boolean;
begin
  -- Fixed one-minute windows, separate read and write budgets; shared across function instances.
  insert into public.contact_like_limits as limits (key, window_start, requests)
  values (rate_key || case when add_like then ':write' else ':read' end, date_trunc('minute', now()), 1)
  on conflict (key) do update set
    requests = case when limits.window_start = excluded.window_start then limits.requests + 1 else 1 end,
    window_start = excluded.window_start
  returning limits.requests into requests;
  if requests > (case when add_like then 10 else 120 end) then
    return jsonb_build_object('limited', true);
  end if;
  delete from public.contact_like_limits where window_start < now() - interval '1 day';
  if add_like then
    insert into public.contact_likes (visitor_id) values (contact_like.visitor_id) on conflict do nothing;
    get diagnostics inserted = row_count;
    if inserted = 1 then
      update public.contact_like_total set total = contact_like_total.total + 1 where id = true;
    end if;
  end if;
  select t.total into total from public.contact_like_total t where id = true;
  select exists(select 1 from public.contact_likes l where l.visitor_id = contact_like.visitor_id) into liked;
  return jsonb_build_object('count', total, 'liked', liked);
end;
$$;
revoke all on function public.contact_like(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.contact_like(uuid, boolean, text) to service_role;
commit;
