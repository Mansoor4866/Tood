-- ==========================================================
-- TOOD ($TOOD) — Robinhood Chain Database Schema
-- Run this script in the Supabase SQL Editor
-- ==========================================================

-- 1. Profiles Table (User Wallets & Stats)
CREATE TABLE IF NOT EXISTS public.profiles (
  wallet_address TEXT PRIMARY KEY,
  custom_name TEXT,
  avatar_url TEXT,
  total_staked_eth NUMERIC DEFAULT 0,
  total_won_eth NUMERIC DEFAULT 0,
  total_staked_usdg NUMERIC DEFAULT 0,
  total_won_usdg NUMERIC DEFAULT 0,
  rounds_played INT DEFAULT 0,
  rounds_won INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Game Rounds Table
CREATE TABLE IF NOT EXISTS public.rounds (
  round_number BIGINT PRIMARY KEY,
  status TEXT DEFAULT 'betting', -- 'betting', 'drawing', 'settled'
  drawn_plot_id INT,
  drawn_cell TEXT,
  winning_token TEXT,
  winning_crew TEXT,
  total_pot_eth NUMERIC DEFAULT 0,
  total_pot_usdg NUMERIC DEFAULT 0,
  winner_count INT DEFAULT 0,
  block_number BIGINT,
  tx_hash TEXT,
  refunded BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

-- 3. Stakes / Activity Log (Every on-chain claim staked by a player)
CREATE TABLE IF NOT EXISTS public.stakes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_number BIGINT REFERENCES public.rounds(round_number) ON DELETE CASCADE,
  wallet_address TEXT REFERENCES public.profiles(wallet_address) ON DELETE CASCADE,
  plot_id INT NOT NULL,
  cell TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  eth_amount NUMERIC DEFAULT 0,
  usdg_amount NUMERIC DEFAULT 0,
  is_winner BOOLEAN DEFAULT FALSE,
  payout_eth NUMERIC DEFAULT 0,
  payout_usdg NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Live Saloon Chat (Realtime Messages)
CREATE TABLE IF NOT EXISTS public.saloon_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  text TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saloon_messages ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access (Anon key can read game states and chat)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles are insertable/updatable" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Rounds are viewable by everyone" ON public.rounds FOR SELECT USING (true);
CREATE POLICY "Rounds are insertable/updatable" ON public.rounds FOR ALL USING (true);

CREATE POLICY "Stakes are viewable by everyone" ON public.stakes FOR SELECT USING (true);
CREATE POLICY "Stakes are insertable/updatable" ON public.stakes FOR ALL USING (true);

CREATE POLICY "Saloon messages are viewable by everyone" ON public.saloon_messages FOR SELECT USING (true);
CREATE POLICY "Saloon messages can be posted by everyone" ON public.saloon_messages FOR INSERT WITH CHECK (true);

-- Enable Realtime Subscriptions for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;
ALTER PUBLICATION supabase_realtime ADD TABLE public.stakes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saloon_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Pre-seed initial saloon chats if table is empty
INSERT INTO public.saloon_messages (wallet_address, text, avatar_url, created_at)
VALUES
  ('0x0c58...c219', 'hi!', 'https://api.dicebear.com/7.x/bottts/svg?seed=1', NOW() - INTERVAL '15 minutes'),
  ('0x4ed4...9ece', 'yo', 'https://api.dicebear.com/7.x/bottts/svg?seed=2', NOW() - INTERVAL '14 minutes'),
  ('0x4ed4...9ece', 'this dope af', 'https://api.dicebear.com/7.x/bottts/svg?seed=2', NOW() - INTERVAL '10 minutes'),
  ('0x0c58...c219', 'go go go', 'https://api.dicebear.com/7.x/bottts/svg?seed=1', NOW() - INTERVAL '5 minutes')
ON CONFLICT DO NOTHING;
