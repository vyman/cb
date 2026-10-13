-- SourceTrade schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL DEFAULT '',
  contact_name  TEXT DEFAULT '',
  phone         TEXT DEFAULT '',
  location      TEXT DEFAULT '',
  commodities   JSONB DEFAULT '[]',
  business_type TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Buyers: full access to their own row
CREATE POLICY "owner_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "owner_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "owner_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admins: read all profiles
CREATE POLICY "admin_select" ON profiles FOR SELECT USING (
  auth.email() = ANY(ARRAY['vyman.huigere@gmail.com'])
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_email      TEXT,
  buyer_name       TEXT NOT NULL DEFAULT '',
  business_type    TEXT DEFAULT '',
  commodity_id     TEXT DEFAULT '',
  commodity_name   TEXT DEFAULT '',
  commodity_icon   TEXT DEFAULT '',
  variety_name     TEXT DEFAULT '',
  grade            TEXT DEFAULT '',
  quantity         NUMERIC DEFAULT 0,
  unit             TEXT DEFAULT 'kg',
  max_budget       NUMERIC DEFAULT 0,
  delivery_by      TEXT DEFAULT '',
  notes            TEXT DEFAULT '',
  status           TEXT DEFAULT 'open',
  quoted_price     NUMERIC,
  estimated_delivery TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Buyers: access only their own orders
CREATE POLICY "owner_select" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "owner_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "owner_update" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Admins: read and update all orders
CREATE POLICY "admin_select" ON orders FOR SELECT USING (
  auth.email() = ANY(ARRAY['vyman.huigere@gmail.com'])
);
CREATE POLICY "admin_update" ON orders FOR UPDATE USING (
  auth.email() = ANY(ARRAY['vyman.huigere@gmail.com'])
);
