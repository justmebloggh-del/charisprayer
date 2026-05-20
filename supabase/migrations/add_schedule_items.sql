-- Schedule items table — editable from admin panel
CREATE TABLE IF NOT EXISTS public.schedule_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day        TEXT NOT NULL UNIQUE,
  short      TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  time_start TEXT NOT NULL DEFAULT '5:00 AM',
  time_end   TEXT NOT NULL DEFAULT '6:00 AM',
  theme      TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT '🙏',
  color      TEXT NOT NULL DEFAULT '#C9A227',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read schedule"   ON public.schedule_items FOR SELECT USING (true);
CREATE POLICY "Admins can insert schedule" ON public.schedule_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update schedule" ON public.schedule_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete schedule" ON public.schedule_items FOR DELETE USING (public.is_admin());

-- Seed default schedule (5:00 AM – 6:00 AM every day)
INSERT INTO public.schedule_items (day, short, sort_order, time_start, time_end, theme, icon, color) VALUES
  ('Monday',    'MON', 1, '5:00 AM', '6:00 AM', 'Praise & Worship',       '🎵', '#F59E0B'),
  ('Tuesday',   'TUE', 2, '5:00 AM', '6:00 AM', 'Faith Declarations',     '🗡️', '#EF4444'),
  ('Wednesday', 'WED', 3, '5:00 AM', '6:00 AM', 'Intercession',           '🌍', '#3B82F6'),
  ('Thursday',  'THU', 4, '5:00 AM', '6:00 AM', 'Healing & Restoration',  '✨', '#8B5CF6'),
  ('Friday',    'FRI', 5, '5:00 AM', '6:00 AM', 'Breakthrough Prayer',    '⚡', '#EC4899'),
  ('Saturday',  'SAT', 6, '5:00 AM', '6:00 AM', 'Family & Nations',       '🏡', '#10B981'),
  ('Sunday',    'SUN', 7, '5:00 AM', '6:00 AM', 'Thanksgiving & Worship', '🙌', '#C9A227')
ON CONFLICT (day) DO NOTHING;
