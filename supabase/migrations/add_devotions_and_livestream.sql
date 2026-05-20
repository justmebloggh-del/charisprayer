-- ═══════════════════════════════════════════════════════════════════════════
-- Charis Prayer — Supabase Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Devotions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS devotions (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title               TEXT        NOT NULL,
  scripture_reference TEXT,
  scripture_text      TEXT,
  message             TEXT        NOT NULL DEFAULT '',
  excerpt             TEXT,
  featured_image_url  TEXT,
  author              TEXT        NOT NULL DEFAULT 'Rev. Emmanuel Oduro Cosby',
  published           BOOLEAN     NOT NULL DEFAULT false,
  featured            BOOLEAN     NOT NULL DEFAULT false,
  scheduled_at        TIMESTAMPTZ,
  views               INTEGER     NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS devotions_updated_at ON devotions;
CREATE TRIGGER devotions_updated_at
  BEFORE UPDATE ON devotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE devotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published devotions" ON devotions;
CREATE POLICY "Public read published devotions" ON devotions
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admin full access devotions" ON devotions;
CREATE POLICY "Admin full access devotions" ON devotions
  FOR ALL USING (auth.uid() IS NOT NULL);


-- ── 2. Livestream Settings (single-row table) ──────────────────────────────
CREATE TABLE IF NOT EXISTS livestream_settings (
  id              INTEGER     PRIMARY KEY DEFAULT 1,
  youtube_url     TEXT,
  replay_url      TEXT,
  is_live         BOOLEAN     NOT NULL DEFAULT false,
  title           TEXT        DEFAULT 'Sunday Service',
  description     TEXT,
  thumbnail_url   TEXT,
  channel_id      TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure exactly one row
INSERT INTO livestream_settings (id, is_live)
VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE livestream_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read livestream" ON livestream_settings;
CREATE POLICY "Public read livestream" ON livestream_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin manage livestream" ON livestream_settings;
CREATE POLICY "Admin manage livestream" ON livestream_settings
  FOR ALL USING (auth.uid() IS NOT NULL);


-- ── 3. Seed: sample devotions ─────────────────────────────────────────────
INSERT INTO devotions (title, scripture_reference, scripture_text, message, excerpt, published, featured)
VALUES
(
  'The Faithfulness of God in Every Season',
  'Lamentations 3:22-23',
  'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.',
  '<p>Every morning you wake up is a declaration of God''s faithfulness. His mercies are not worn out or depleted — they are freshly given to you today.</p><p>Whatever yesterday looked like, this morning carries new grace, new strength, and new opportunity to encounter the living God. Do not let the weight of yesterday steal the gift of today.</p><p>Let this truth anchor your heart: the God who was faithful yesterday is faithful right now. He has not changed His mind about you. He has not walked away. His love is not contingent on your performance — it is rooted in His character.</p>',
  'Every morning you wake up is a declaration of God''s faithfulness. His mercies are not worn out — they are freshly given to you today.',
  true, true
),
(
  'When You Feel Overwhelmed, Pray',
  'Philippians 4:6-7',
  'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.',
  '<p>Anxiety is real, but it does not have to be your final address. God invites you to bring every burden, every fear, every unanswered question into His presence.</p><p>Notice the instruction: in everything — not just the big things, but every little concern that weighs on your heart. God is interested in the details of your life. He cares about what keeps you up at night.</p><p>And when you pray, add thanksgiving. Not because everything is perfect, but because you serve a God who is bigger than your circumstances.</p>',
  'Anxiety is real, but it does not have to be your final address. God invites you to bring every burden into His presence.',
  true, false
)
ON CONFLICT DO NOTHING;
