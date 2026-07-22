/*
# Add missing Hikes fields: date, video, route, map, available seats, status

## Problem
The Hikes admin form and public pages already cover name, location,
difficulty, duration, distance, price, image, gallery, description,
highlights, season, and featured — but the spec calls for a full CRUD
covering Date, Video, Route, Map, Available Seats, and Status as well,
none of which existed as columns. There was also no publish/unpublish
concept at all for hikes: every row was always publicly visible with
no way to save a draft.

## Changes
- Add hike_date (the scheduled date, distinct from created_at)
- Add video (optional hike video URL, matching the image/gallery pattern)
- Add route_url and map_url (matches the existing Contact map pattern)
- Add available_seats (nullable = unlimited/not tracked, matching
  current behavior for every existing hike)
- Add status ('published' | 'draft') defaulting to 'published' so
  every existing hike keeps behaving exactly as it does today
- Update the public SELECT policy to only expose status = 'published'
  rows, while admins (via the existing user_profiles.role check
  pattern) can see everything through the admin service functions
*/

ALTER TABLE hikes ADD COLUMN IF NOT EXISTS hike_date DATE;
ALTER TABLE hikes ADD COLUMN IF NOT EXISTS video VARCHAR(500);
ALTER TABLE hikes ADD COLUMN IF NOT EXISTS route_url VARCHAR(500);
ALTER TABLE hikes ADD COLUMN IF NOT EXISTS map_url VARCHAR(500);
ALTER TABLE hikes ADD COLUMN IF NOT EXISTS available_seats INTEGER;
ALTER TABLE hikes ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'published'
  CHECK (status IN ('published', 'draft'));

CREATE INDEX IF NOT EXISTS idx_hikes_status ON hikes(status);

-- Replace the public read policy so drafts are hidden from the public
-- site. Admin access continues to go through services/admin.ts, which
-- already authenticates as an admin user and is unaffected by this.
DROP POLICY IF EXISTS "hikes_select_policy" ON hikes;

CREATE POLICY "hikes_select_public" ON hikes FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "hikes_select_admin" ON hikes FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
