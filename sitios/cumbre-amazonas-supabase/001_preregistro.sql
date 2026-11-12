-- Proyecto Supabase "cumbre-amazonas" (ref pzrrkcsftchkqmxczlhu), organización KUBIA.
-- Migración aplicada el 2026-11-12. Pre-registro de la Cumbre Amazonas 2026.
-- Seguridad: anon NO toca la tabla; solo ejecuta preregistrar(). Solo los correos de `admins`
-- leen y cambian estado/notas (panel en /panel). Los registros son datos personales de terceros:
-- nunca se copian al repo ni al chat.

create extension if not exists pgcrypto with schema extensions;

create table public.admins (
  email text primary key check (email = lower(email))
);

create table public.preregistros (
  id uuid primary key default gen_random_uuid(),
  creado timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 2 and 80),
  whatsapp text not null unique check (whatsapp ~ '^[0-9]{10,15}$'),
  negocio text check (char_length(negocio) <= 100),
  rubro text check (char_length(rubro) <= 60),
  origen text check (char_length(origen) <= 60),
  utm_source text check (char_length(utm_source) <= 80),
  utm_medium text check (char_length(utm_medium) <= 80),
  utm_campaign text check (char_length(utm_campaign) <= 80),
  estado text not null default 'registrado' check (estado in ('registrado','contactado','pagado','descartado')),
  notas text check (char_length(notas) <= 500),
  actualizado timestamptz,
  ip_hash text
);
create index preregistros_creado on public.preregistros (creado desc);
create index preregistros_ip on public.preregistros (ip_hash, creado);

alter table public.admins enable row level security;
alter table public.preregistros enable row level security;

-- Guardián único: boolean NOT NULL, nunca NULL
create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select exists (select 1 from public.admins a where a.email = lower(auth.jwt() ->> 'email'))
       and (auth.jwt() ->> 'aud') = 'authenticated'), false)
$$;

create policy admin_lee on public.preregistros for select to authenticated using ((select public.es_admin()));
create policy admin_actualiza on public.preregistros for update to authenticated
  using ((select public.es_admin())) with check ((select public.es_admin()));

revoke all on public.preregistros from anon, authenticated, public;
revoke all on public.admins from anon, authenticated, public;
grant select, update (estado, notas, actualizado) on public.preregistros to authenticated;

create or replace function public.preregistrar(
  p_nombre text, p_whatsapp text, p_negocio text default null, p_rubro text default null,
  p_origen text default null, p_utm_source text default null, p_utm_medium text default null,
  p_utm_campaign text default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_tel text := regexp_replace(coalesce(p_whatsapp,''), '[^0-9]', '', 'g');
  v_ip text := split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1);
  v_hash text;
  v_recientes int;
begin
  -- 0412... -> 58412... ; 412... -> 58412...
  if v_tel ~ '^0[0-9]{10}$' then v_tel := '58' || substr(v_tel, 2);
  elsif v_tel ~ '^4[0-9]{9}$' then v_tel := '58' || v_tel;
  end if;
  if char_length(btrim(coalesce(p_nombre,''))) < 2 then return 'nombre_invalido'; end if;
  if v_tel !~ '^[0-9]{10,15}$' then return 'telefono_invalido'; end if;

  v_hash := encode(extensions.digest(v_ip || ':cumbre2026', 'sha256'), 'hex');
  select count(*) into v_recientes from public.preregistros
    where ip_hash = v_hash and creado > now() - interval '1 hour';
  if v_ip <> '' and v_recientes >= 8 then return 'demasiados_intentos'; end if;

  insert into public.preregistros (nombre, whatsapp, negocio, rubro, origen, utm_source, utm_medium, utm_campaign, ip_hash)
  values (left(btrim(p_nombre),80), v_tel, nullif(left(btrim(coalesce(p_negocio,'')),100),''),
          nullif(left(btrim(coalesce(p_rubro,'')),60),''), nullif(left(btrim(coalesce(p_origen,'')),60),''),
          nullif(left(p_utm_source,80),''), nullif(left(p_utm_medium,80),''), nullif(left(p_utm_campaign,80),''), v_hash)
  on conflict (whatsapp) do nothing;
  if not found then return 'ya_registrado'; end if;
  return 'ok';
end $$;

-- Supabase concede EXECUTE a anon directo: revocar explícito
revoke execute on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;
revoke execute on function public.preregistrar(text,text,text,text,text,text,text,text) from public;
grant execute on function public.preregistrar(text,text,text,text,text,text,text,text) to anon, authenticated;

insert into public.admins (email) values ('kubiasoluciones@gmail.com');
