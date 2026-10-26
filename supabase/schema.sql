create extension if not exists pgcrypto;

create table if not exists public.portfolio_site (
  id text primary key check (id = 'site'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id text primary key,
  slug text not null unique,
  document jsonb not null,
  published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_messages (
  id text primary key,
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 200),
  message text not null check (char_length(message) <= 5000),
  received_at timestamptz not null default now()
);

create index if not exists portfolio_messages_received_at_idx
  on public.portfolio_messages (received_at desc);

create table if not exists public.portfolio_contact_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  request_count integer not null check (request_count >= 0)
);

alter table public.portfolio_site enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_messages enable row level security;
alter table public.portfolio_contact_rate_limits enable row level security;

revoke all on public.portfolio_site, public.portfolio_projects,
  public.portfolio_messages, public.portfolio_contact_rate_limits
  from anon, authenticated;
grant all on public.portfolio_site, public.portfolio_projects,
  public.portfolio_messages, public.portfolio_contact_rate_limits
  to service_role;

create or replace function public.replace_portfolio_projects(projects_payload jsonb)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if jsonb_typeof(projects_payload) is distinct from 'array' then
    raise exception 'projects_payload must be a JSON array';
  end if;

  delete from public.portfolio_projects;

  insert into public.portfolio_projects (id, slug, document, published, position)
  select
    item->>'id',
    item->>'slug',
    item,
    coalesce((item->>'published')::boolean, true),
    ordinal::integer
  from jsonb_array_elements(projects_payload) with ordinality as rows(item, ordinal);
end;
$$;

revoke all on function public.replace_portfolio_projects(jsonb) from public, anon, authenticated;
grant execute on function public.replace_portfolio_projects(jsonb) to service_role;

create or replace function public.store_portfolio_message(message_payload jsonb)
returns void
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  insert into public.portfolio_messages (id, name, email, message, received_at)
  values (
    message_payload->>'id',
    message_payload->>'name',
    message_payload->>'email',
    message_payload->>'message',
    coalesce((message_payload->>'received_at')::timestamptz, now())
  );

  delete from public.portfolio_messages
  where id in (
    select id from public.portfolio_messages
    order by received_at desc
    offset 500
  );
end;
$$;

revoke all on function public.store_portfolio_message(jsonb) from public, anon, authenticated;
grant execute on function public.store_portfolio_message(jsonb) to service_role;

create or replace function public.consume_portfolio_contact_limit(
  supplied_hash text,
  max_requests integer default 5,
  window_seconds integer default 3600
)
returns boolean
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  current_count integer;
begin
  delete from public.portfolio_contact_rate_limits
  where window_started_at < now() - make_interval(secs => window_seconds * 2);

  insert into public.portfolio_contact_rate_limits (ip_hash, window_started_at, request_count)
  values (supplied_hash, now(), 1)
  on conflict (ip_hash) do update set
    window_started_at = case
      when portfolio_contact_rate_limits.window_started_at < now() - make_interval(secs => window_seconds) then now()
      else portfolio_contact_rate_limits.window_started_at
    end,
    request_count = case
      when portfolio_contact_rate_limits.window_started_at < now() - make_interval(secs => window_seconds) then 1
      else portfolio_contact_rate_limits.request_count + 1
    end
  returning request_count into current_count;

  return current_count <= max_requests;
end;
$$;

revoke all on function public.consume_portfolio_contact_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_portfolio_contact_limit(text, integer, integer) to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-assets', 'portfolio-assets', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Browser roles receive no upload/update/delete policy. Server routes use the
-- service role only after checking the admin session; public bucket is read-only.
