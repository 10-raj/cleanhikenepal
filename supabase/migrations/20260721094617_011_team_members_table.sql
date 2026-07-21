/*
# Create team_members table

## Problem
Same class of bug as hero_banners: `src/services/admin.ts` (full CRUD
used by AdminTeamPage/TeamManager) and `src/pages/AboutPage.tsx`
(Founder Members section) both already query a `team_members` table
that was never created. The Admin Panel's Team module could never
actually save anything, and the About page always fell back to its
hardcoded fallbackTeam array.

## Changes
- Create `team_members` with the exact columns the frontend already
  uses: name, role, bio, image, social_links (jsonb), display_order,
  is_active.
- Public can read active members only; admins (via user_profiles.role)
  can fully manage all members.
- Seed with the four founders currently hardcoded as AboutPage's
  fallback, so nothing visually changes on the live site and the admin
  has real rows to edit immediately.
*/

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  image VARCHAR(500),
  social_links JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_select_public" ON team_members FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "team_members_select_admin" ON team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_members_insert_admin" ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_members_update_admin" ON team_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_members_delete_admin" ON team_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO team_members (name, role, bio, image, social_links, display_order, is_active)
VALUES
  (
    'Avib Adhikari',
    'Founder & CEO',
    'Lifetime mountaineer with 30+ years of Himalayan experience',
    'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    '{}'::jsonb,
    1,
    true
  ),
  (
    'Umang Raj Gurung',
    'Environmental Director',
    'Environmental scientist specializing in sustainable tourism',
    'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=400',
    '{}'::jsonb,
    2,
    true
  ),
  (
    'Raj Acharya',
    'Community Liaison',
    'Connects trekkers with authentic local experiences',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    '{}'::jsonb,
    3,
    true
  ),
  (
    'Alice KC',
    'Head Guide',
    'Led 500+ successful expeditions across Nepal',
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    '{}'::jsonb,
    4,
    true
  );
