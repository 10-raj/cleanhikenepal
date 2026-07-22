/*
# Enhance Hero Banners for full CMS + Create About Content table

## Changes
1. hero_banners: add description, mobile_image, overlay_opacity, text_alignment, status, start_date, end_date, open_new_tab
2. about_content: new table for About page CMS (founders, history, mission, vision)
*/

-- ── hero_banners enhancements ──
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS mobile_image VARCHAR(500);
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS overlay_opacity INTEGER NOT NULL DEFAULT 50
  CHECK (overlay_opacity >= 0 AND overlay_opacity <= 100);
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS text_alignment VARCHAR(20) NOT NULL DEFAULT 'center'
  CHECK (text_alignment IN ('left', 'center', 'right'));
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
  CHECK (status IN ('published', 'draft'));
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;
ALTER TABLE hero_banners ADD COLUMN IF NOT EXISTS open_new_tab BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_hero_banners_status ON hero_banners(status);
CREATE INDEX IF NOT EXISTS idx_hero_banners_dates ON hero_banners(start_date, end_date);

DROP POLICY IF EXISTS "hero_banners_select_public" ON hero_banners;
CREATE POLICY "hero_banners_select_public" ON hero_banners FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND status = 'published');

-- ── about_content table ──
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(50) NOT NULL CHECK (section IN ('founders', 'history', 'mission', 'vision', 'values', 'story')),
  title VARCHAR(255),
  subtitle TEXT,
  description TEXT,
  image VARCHAR(500),
  designation VARCHAR(255),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_content_section ON about_content(section);
CREATE INDEX IF NOT EXISTS idx_about_content_active ON about_content(is_active);
CREATE INDEX IF NOT EXISTS idx_about_content_order ON about_content(display_order);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "about_content_select_public" ON about_content;
CREATE POLICY "about_content_select_public" ON about_content FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND status = 'published');

DROP POLICY IF EXISTS "about_content_select_admin" ON about_content;
CREATE POLICY "about_content_select_admin" ON about_content FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "about_content_insert_admin" ON about_content;
CREATE POLICY "about_content_insert_admin" ON about_content FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "about_content_update_admin" ON about_content;
CREATE POLICY "about_content_update_admin" ON about_content FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "about_content_delete_admin" ON about_content;
CREATE POLICY "about_content_delete_admin" ON about_content FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO about_content (section, title, subtitle, description, display_order, is_active, status)
VALUES
  ('mission', 'Our Mission', NULL, 'To preserve Nepal''s natural trails by combining hiking with environmental cleanup, creating a sustainable impact on local communities and ecosystems.', 1, true, 'published'),
  ('vision', 'Our Vision', NULL, 'A Nepal where every trail is clean, every hiker is an environmental steward, and every community thrives in harmony with nature.', 2, true, 'published'),
  ('history', 'Our History', NULL, 'CleanHike Nepal began with a simple idea: that every hiker could be a force for keeping the trails clean. What started as small weekend cleanups has grown into a movement.', 3, true, 'published')
ON CONFLICT DO NOTHING;
