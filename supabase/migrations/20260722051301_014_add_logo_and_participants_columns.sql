/*
# Add site_logo_url and next_hike_participants columns to website_settings

## Changes
1. Add `site_logo_url` (varchar) — stores custom logo URL for the Logo Manager
2. Add `next_hike_participants` (varchar) — stores expected participants for the next hike

## Security
- No RLS policy changes — website_settings already has admin-only access
*/

ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS site_logo_url VARCHAR(500);
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS next_hike_participants VARCHAR(255);
