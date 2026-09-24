-- =====================================================================
-- SYTRAEX  -  Supabase veritabanı şeması (v1)
-- Supabase > SQL Editor > New query  ->  tamamını yapıştır  ->  Run
-- Tekrar çalıştırmak güvenlidir (idempotent olacak şekilde yazıldı).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) PROFİLLER  (auth.users ile 1-1; herkese açık alanlar)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null,
  full_name   text,
  avatar_url  text,
  bio         text,
  city        text,
  country     text,
  created_at  timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_.]{3,24}$'),
  constraint profiles_bio_len check (bio is null or char_length(bio) <= 300),
  constraint profiles_name_len check (full_name is null or char_length(full_name) <= 80)
);
create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username));

-- ---------------------------------------------------------------------
-- 2) GÖNDERİLER (seyahat deneyimleri)
-- ---------------------------------------------------------------------
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  title         text not null check (char_length(title) between 5 and 140),
  location      text not null check (char_length(location) between 2 and 120),
  duration      text not null check (duration in ('3h','day','1d','weekend','1w')),
  mode          text not null check (mode in ('night','day','history','nature','food','adventure','budget')),
  images        text[] not null default '{}' check (array_length(images,1) between 1 and 10),
  youtube_url   text check (youtube_url is null or char_length(youtube_url) <= 200),
  summary       text not null check (char_length(summary) between 20 and 4000),
  sightseeing   text check (sightseeing is null or char_length(sightseeing) <= 4000),
  stay          text check (stay is null or char_length(stay) <= 4000),
  food          text check (food is null or char_length(food) <= 4000),
  tips          text check (tips is null or char_length(tips) <= 4000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists posts_user_idx     on public.posts (user_id, created_at desc);
create index if not exists posts_created_idx  on public.posts (created_at desc);
create index if not exists posts_location_idx on public.posts (lower(location));

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 3) PUANLAR ve YORUMLAR
-- ---------------------------------------------------------------------
create table if not exists public.post_ratings (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  score      smallint not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

-- ---------------------------------------------------------------------
-- 4) MESAJ İSTEKLERİ ve MESAJLAR
-- ---------------------------------------------------------------------
create table if not exists public.message_requests (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  intro       text check (intro is null or char_length(intro) <= 300),
  status      text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at  timestamptz not null default now(),
  constraint no_self_request check (sender_id <> receiver_id),
  constraint one_request_per_pair unique (sender_id, receiver_id)
);
create index if not exists mreq_receiver_idx on public.message_requests (receiver_id, status);

create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.message_requests(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  body       text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_req_idx on public.messages (request_id, created_at);

-- ---------------------------------------------------------------------
-- 5) SYTX PUAN DEFTERİ  (sunucu tarafında yazılır; istemci sadece okur)
--    NOT: Bu puanlar zincir dışı (off-chain) sadakat puanıdır.
-- ---------------------------------------------------------------------
create table if not exists public.sytx_ledger (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  kind        text not null check (kind in ('welcome','post')),
  ref_id      uuid,
  description text,
  amount      integer not null check (amount > 0),
  created_at  timestamptz not null default now()
);
create index if not exists ledger_user_idx on public.sytx_ledger (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 6) ŞİKAYETLER (içerik moderasyonu)
-- ---------------------------------------------------------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','comment','profile')),
  target_id   uuid not null,
  reason      text not null check (char_length(reason) between 3 and 500),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7) YENİ KULLANICI TETİKLEYİCİSİ  (e-posta ve Google girişi için ortak)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  meta   jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  base   text;
  uname  text;
  tries  int := 0;
begin
  base := lower(regexp_replace(
            coalesce(nullif(meta->>'username',''), split_part(coalesce(new.email,'user'),'@',1)),
            '[^a-zA-Z0-9_.]', '', 'g'));
  if char_length(base) < 3 then base := 'user' || base; end if;
  base  := left(base, 18);
  uname := base;
  while exists (select 1 from public.profiles where lower(username) = uname) and tries < 20 loop
    uname := base || (floor(random() * 9000) + 1000)::int::text;
    tries := tries + 1;
  end loop;

  insert into public.profiles (id, username, full_name, avatar_url, city, country)
  values (
    new.id, uname,
    left(coalesce(nullif(meta->>'full_name',''), nullif(meta->>'name','')), 80),
    coalesce(nullif(meta->>'avatar_url',''), nullif(meta->>'picture','')),
    left(nullif(meta->>'city',''), 80),
    left(nullif(meta->>'country',''), 80)
  );

  insert into public.sytx_ledger (user_id, kind, description, amount)
  values (new.id, 'welcome', 'Sytraex platformuna kayıt ödülü', 10);

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 8) GÖNDERİ ÖDÜLÜ  (+25 SYTX; günde en fazla 3 ödüllü gönderi, kaliteli içerik şartı)
-- ---------------------------------------------------------------------
create or replace function public.reward_post() returns trigger
language plpgsql security definer set search_path = '' as $$
declare rewarded_today int;
begin
  if char_length(new.summary) >= 100 and array_length(new.images,1) >= 1 then
    select count(*) into rewarded_today from public.sytx_ledger
      where user_id = new.user_id and kind = 'post' and created_at > now() - interval '24 hours';
    if rewarded_today < 3 then
      insert into public.sytx_ledger (user_id, kind, ref_id, description, amount)
      values (new.user_id, 'post', new.id, left(new.title, 140), 25);
    end if;
  end if;
  return new;
end $$;
drop trigger if exists posts_reward on public.posts;
create trigger posts_reward after insert on public.posts
  for each row execute function public.reward_post();

-- ---------------------------------------------------------------------
-- 9) YARDIMCI FONKSİYONLAR
-- ---------------------------------------------------------------------
create or replace function public.username_available(u text) returns boolean
language sql security definer stable set search_path = '' as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(u));
$$;

-- Kullanıcının kendi hesabını (ve tüm verisini) silmesi - KVKK "silme hakkı"
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end $$;

-- ---------------------------------------------------------------------
-- 10) GÖRÜNÜM: gönderi + yazar + puan özeti
-- ---------------------------------------------------------------------
create or replace view public.posts_feed with (security_invoker = true) as
select p.*,
       pr.username,
       pr.full_name  as author_name,
       pr.avatar_url as author_avatar,
       coalesce(s.avg_score, 0) as avg_score,
       coalesce(s.votes, 0)     as votes,
       coalesce(c.cnt, 0)       as comments_count
from public.posts p
join public.profiles pr on pr.id = p.user_id
left join lateral (select round(avg(score)::numeric, 1) as avg_score, count(*)::int as votes
                   from public.post_ratings r where r.post_id = p.id) s on true
left join lateral (select count(*)::int as cnt
                   from public.comments cm where cm.post_id = p.id) c on true;

-- ---------------------------------------------------------------------
-- 11) YETKİLER  (tablolar otomatik açılmadığı için tek tek veriyoruz)
-- ---------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;

grant select on public.profiles, public.posts, public.post_ratings, public.comments, public.posts_feed to anon, authenticated;

grant insert, update (username, full_name, avatar_url, bio, city, country) on public.profiles to authenticated;
grant insert, update, delete on public.posts to authenticated;
grant insert, update, delete on public.post_ratings to authenticated;
grant insert, delete on public.comments to authenticated;

grant select, insert on public.message_requests to authenticated;
grant update (status) on public.message_requests to authenticated;
grant select, insert on public.messages to authenticated;
grant select on public.sytx_ledger to authenticated;
grant insert on public.reports to authenticated;

grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.reward_post() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 12) ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.posts             enable row level security;
alter table public.post_ratings      enable row level security;
alter table public.comments          enable row level security;
alter table public.message_requests  enable row level security;
alter table public.messages          enable row level security;
alter table public.sytx_ledger       enable row level security;
alter table public.reports           enable row level security;

-- profiles
drop policy if exists "profiles_select_all"  on public.profiles;
drop policy if exists "profiles_update_own"  on public.profiles;
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- posts
drop policy if exists "posts_select_all"  on public.posts;
drop policy if exists "posts_insert_own"  on public.posts;
drop policy if exists "posts_update_own"  on public.posts;
drop policy if exists "posts_delete_own"  on public.posts;
create policy "posts_select_all" on public.posts for select using (true);
create policy "posts_insert_own" on public.posts for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "posts_update_own" on public.posts for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "posts_delete_own" on public.posts for delete to authenticated
  using (user_id = (select auth.uid()));

-- ratings (kendi gönderine puan veremezsin)
drop policy if exists "ratings_select_all"  on public.post_ratings;
drop policy if exists "ratings_insert_own"  on public.post_ratings;
drop policy if exists "ratings_update_own"  on public.post_ratings;
drop policy if exists "ratings_delete_own"  on public.post_ratings;
create policy "ratings_select_all" on public.post_ratings for select using (true);
create policy "ratings_insert_own" on public.post_ratings for insert to authenticated
  with check (user_id = (select auth.uid())
              and (select p.user_id from public.posts p where p.id = post_id) <> (select auth.uid()));
create policy "ratings_update_own" on public.post_ratings for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "ratings_delete_own" on public.post_ratings for delete to authenticated
  using (user_id = (select auth.uid()));

-- comments (yazan veya gönderi sahibi silebilir)
drop policy if exists "comments_select_all"  on public.comments;
drop policy if exists "comments_insert_own"  on public.comments;
drop policy if exists "comments_delete"      on public.comments;
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "comments_delete" on public.comments for delete to authenticated
  using (user_id = (select auth.uid())
         or exists (select 1 from public.posts p where p.id = post_id and p.user_id = (select auth.uid())));

-- message_requests
drop policy if exists "mreq_select_participant" on public.message_requests;
drop policy if exists "mreq_insert_sender"      on public.message_requests;
drop policy if exists "mreq_update_receiver"    on public.message_requests;
create policy "mreq_select_participant" on public.message_requests for select to authenticated
  using ((select auth.uid()) in (sender_id, receiver_id));
create policy "mreq_insert_sender" on public.message_requests for insert to authenticated
  with check (sender_id = (select auth.uid()) and status = 'pending');
create policy "mreq_update_receiver" on public.message_requests for update to authenticated
  using (receiver_id = (select auth.uid()))
  with check (receiver_id = (select auth.uid()) and status in ('accepted','rejected'));

-- messages (yalnızca kabul edilmiş konuşmalarda)
drop policy if exists "messages_select_participant" on public.messages;
drop policy if exists "messages_insert_participant" on public.messages;
create policy "messages_select_participant" on public.messages for select to authenticated
  using (exists (select 1 from public.message_requests r
                 where r.id = request_id and (select auth.uid()) in (r.sender_id, r.receiver_id)));
create policy "messages_insert_participant" on public.messages for insert to authenticated
  with check (sender_id = (select auth.uid())
              and exists (select 1 from public.message_requests r
                          where r.id = request_id and r.status = 'accepted'
                            and (select auth.uid()) in (r.sender_id, r.receiver_id)));

-- ledger: sadece kendi kayıtlarını okur; yazma yalnızca tetikleyicilerden
drop policy if exists "ledger_select_own" on public.sytx_ledger;
create policy "ledger_select_own" on public.sytx_ledger for select to authenticated
  using (user_id = (select auth.uid()));

-- reports: sadece ekleme
drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- 13) GERÇEK ZAMANLI MESAJLAŞMA
-- ---------------------------------------------------------------------
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 14) DEPOLAMA (fotoğraflar)  -  dosyalar {kullanici_id}/dosya.webp yoluna yazılır
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars',     'avatars',     true, 2097152, array['image/jpeg','image/png','image/webp']),
  ('post-images', 'post-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "sytraex_upload_own_folder" on storage.objects;
drop policy if exists "sytraex_update_own_folder" on storage.objects;
drop policy if exists "sytraex_delete_own_folder" on storage.objects;
create policy "sytraex_upload_own_folder" on storage.objects for insert to authenticated
  with check (bucket_id in ('avatars','post-images') and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "sytraex_update_own_folder" on storage.objects for update to authenticated
  using (bucket_id in ('avatars','post-images') and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "sytraex_delete_own_folder" on storage.objects for delete to authenticated
  using (bucket_id in ('avatars','post-images') and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Bitti. Kontrol: Table Editor'de profiles, posts, comments ... tablolarını görmelisin.
