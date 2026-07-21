/*
# Create hero_banners table

## Problem
Both `src/components/admin/BannerManager.tsx` (Admin Panel) and
`src/components/sections/BannerCarousel.tsx` (public homepage) already
fully query a `hero_banners` table, but no migration ever created it.
Every read/write silently failed (BannerManager showed a "table not
found" warning) and the homepage always fell back to hardcoded default
slides — making the Banner Manager appear completely broken even
though the surrounding React code was correct.

## Changes
- Create `hero_banners` with the exact columns already used by the
  frontend: image, title, subtitle, button_text, button_link,
  sort_order, is_active, icon.
- Public can read active banners only.
- Admins (checked via user_profiles.role, matching the pattern already
  fixed for hikes/gallery/sponsors/donation_campaigns) can fully manage
  all banners regardless of active state.
*/

CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image VARCHAR(500) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(500),
  button_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  icon VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON hero_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_banners_sort_order ON hero_banners(sort_order);

ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_banners_select_public" ON hero_banners FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "hero_banners_select_admin" ON hero_banners FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "hero_banners_insert_admin" ON hero_banners FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "hero_banners_update_admin" ON hero_banners FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "hero_banners_delete_admin" ON hero_banners FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed with the two slides that were previously hardcoded as the
-- BannerCarousel's local fallback, so the homepage looks identical
-- immediately after this migration runs (no visual change at launch),
-- and the admin now has real rows to edit instead of empty state.
INSERT INTO hero_banners (image, title, subtitle, button_text, button_link, sort_order, is_active, icon)
VALUES
  (
    'https://images.pexels.com/photos/2387878/pexels-photo-2387878.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'Join the Clean Hike Movement',
    'Every step matters. Together we preserve Nepal''s breathtaking trails for generations to come.',
    'Join Upcoming Clean Hike',
    '/contact#join-us-for-clean-hike',
    1,
    true,
    'mountain'
  ),
  (
    'https://images.pexels.com/photos/12715946/pexels-photo-12715946.jpeg?auto=compress&cs=tinysrgb&w=1920',
    'Our Moments',
    'Captured memories from our clean hikes and community events. Relive the trails, the smiles, and the impact.',
    'View Gallery',
    '/gallery',
    2,
    true,
    'camera'
  );
