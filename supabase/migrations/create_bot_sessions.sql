-- Create bot_sessions table for Telegram Bot state persistence
create table if not exists public.bot_sessions (
  user_id bigint primary key,
  person_image text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.bot_sessions enable row level security;

-- Allow anonymous access for the bot (since we use the anon key in lib/supabase.ts)
-- In a production app, you'd use service_role key server-side or more restrictive policies.
create policy "Allow all access to bot_sessions for anon" on public.bot_sessions
  for all using (true) with check (true);
