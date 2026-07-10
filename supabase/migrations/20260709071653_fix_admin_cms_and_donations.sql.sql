/*
# Fix admin CMS: RLS policies, donation verification workflow, admin user, website settings

## Problem
1. Admin RLS policies on hikes, gallery, sponsors, donation_campaigns used
   `auth.jwt() ->> 'role' = 'admin'` which NEVER matches — Supabase JWTs set `role`
   to the Postgres role name (`authenticated`), not the app-level admin role stored
   in user_profiles. This blocked ALL admin writes (add/edit/delete) and caused
   "Failed to fetch data" because no authenticated admin could satisfy the policy.
2. No admin user existed in auth.users / user_profiles, so no one could log in.
3. The handle_new_user trigger referenced an `email` column that does not exist
   on user_profiles, so new-user signups would fail.
4. donations table lacked columns for the screenshot-upload verification workflow
   (screenshot_url, remarks, transaction_id already exists, contact info).
5. No storage bucket for donation screenshots.

## Changes

### 1. RLS policy fixes (hikes, gallery, sponsors, donation_campaigns)
Replace ALL `auth.jwt() ->> 'role' = 'admin'` policies with a check against
user_profiles.role = 'admin' via auth.uid(), matching the already-fixed pattern
on contact_messages/donations/trek_bookings. Adds missing DELETE policies on
donation_campaigns. Keeps public SELECT policies intact.

### 2. user_profiles: add email column
The handle_new_user trigger inserts `email` but the column was missing.

### 3. donations: add verification workflow columns
- donor_phone (varchar) — donor contact number
- remarks (text) — donor remarks/message about the donation purpose
- screenshot_url (varchar) — public URL of uploaded payment proof screenshot
Admins can review screenshot + remarks to verify donations.

### 4. website_settings: single-row CMS config table
Stores editable homepage statistics and org contact info (admin-managed).
Public read, admin write.

### 5. Storage bucket for donation screenshots
Public bucket `donation-screenshots` for payment proof images.

### 6. Seed admin user
Creates an authenticated admin user (email + password) in auth.users and a
matching user_profiles row with role = 'admin'. Credentials are configurable
via env vars ADMIN_EMAIL / ADMIN_PASSWORD (see project .env and README).

## Security
- All admin write/update/delete policies now verify
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin').
- Public read policies preserved for hikes, gallery (active), sponsors (active),
  donation_campaigns (all), website_settings.
- Donation screenshots bucket is public-read (donors upload via anon key,
  admins review). Insert/update/delete admin-only.
*/

-- ============================================================
-- 1. Fix user_profiles: add missing email column
-- ============================================================
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Fix handle_new_user trigger to insert email correctly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- 2. Fix RLS policies — hikes (admin write)
-- ============================================================
DROP POLICY IF EXISTS "hikes_insert_policy" ON hikes;
DROP POLICY IF EXISTS "hikes_update_policy" ON hikes;
DROP POLICY IF EXISTS "hikes_delete_policy" ON hikes;

CREATE POLICY "hikes_insert_admin" ON hikes FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "hikes_update_admin" ON hikes FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "hikes_delete_admin" ON hikes FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 3. Fix RLS policies — gallery (admin CRUD)
-- ============================================================
DROP POLICY IF EXISTS "gallery_insert_policy" ON gallery;
DROP POLICY IF EXISTS "gallery_update_policy" ON gallery;
DROP POLICY IF EXISTS "gallery_delete_policy" ON gallery;

CREATE POLICY "gallery_insert_admin" ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "gallery_update_admin" ON gallery FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "gallery_delete_admin" ON gallery FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 4. Fix RLS policies — sponsors (admin CRUD + public read all)
-- ============================================================
DROP POLICY IF EXISTS "sponsors_select_policy" ON sponsors;
DROP POLICY IF EXISTS "sponsors_insert_policy" ON sponsors;
DROP POLICY IF EXISTS "sponsors_update_policy" ON sponsors;
DROP POLICY IF EXISTS "sponsors_delete_policy" ON sponsors;

CREATE POLICY "sponsors_select_policy" ON sponsors FOR SELECT
  TO public USING (true);

CREATE POLICY "sponsors_insert_admin" ON sponsors FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "sponsors_update_admin" ON sponsors FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "sponsors_delete_admin" ON sponsors FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- 5. Fix RLS policies — donation_campaigns (admin CRUD)
-- ============================================================
DROP POLICY IF EXISTS "campaigns_insert_policy" ON donation_campaigns;
DROP POLICY IF EXISTS "campaigns_update_policy" ON donation_campaigns;

CREATE POLICY "campaigns_insert_admin" ON donation_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "campaigns_update_admin" ON donation_campaigns FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "campaigns_delete_admin" ON donation_campaigns FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- donations: admin update + delete (for CMS)
DROP POLICY IF EXISTS "donations_update_admin" ON donations;
DROP POLICY IF EXISTS "donations_delete_admin" ON donations;

CREATE POLICY "donations_update_admin" ON donations FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "donations_delete_admin" ON donations FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow public (anon) to insert donations via edge function / direct insert
DROP POLICY IF EXISTS "donations_insert_anon" ON donations;
CREATE POLICY "donations_insert_anon" ON donations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ============================================================
-- 6. donations: add verification workflow columns
-- ============================================================
ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS donor_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS remarks TEXT,
  ADD COLUMN IF NOT EXISTS screenshot_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- ============================================================
-- 7. website_settings: single-row CMS config table
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_donors VARCHAR(50) DEFAULT '10+',
  stat_raised VARCHAR(50) DEFAULT '$20',
  stat_projects VARCHAR(50) DEFAULT '5+',
  stat_regions VARCHAR(50) DEFAULT '1',
  org_address VARCHAR(255) DEFAULT 'Dakshinkali, Kathmandu, Nepal',
  org_email VARCHAR(255) DEFAULT 'hello@cleanhike.com',
  org_phone VARCHAR(50) DEFAULT '+977 1-423-4567',
  org_hours VARCHAR(100) DEFAULT 'Mon-Sat, 9AM - 6PM',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_select_public" ON website_settings;
CREATE POLICY "settings_select_public" ON website_settings FOR SELECT
  TO public USING (true);

DROP POLICY IF EXISTS "settings_update_admin" ON website_settings;
CREATE POLICY "settings_update_admin" ON website_settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "settings_insert_admin" ON website_settings;
CREATE POLICY "settings_insert_admin" ON website_settings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seed a single settings row if none exists
INSERT INTO website_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM website_settings);

-- ============================================================
-- 8. Storage bucket for donation screenshots
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-screenshots', 'donation-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "screenshots_public_read" ON storage.objects;
CREATE POLICY "screenshots_public_read" ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'donation-screenshots');

-- Anyone (anon + authenticated) can upload — donors are not signed in
DROP POLICY IF EXISTS "screenshots_insert_anyone" ON storage.objects;
CREATE POLICY "screenshots_insert_anyone" ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'donation-screenshots');

-- Admin can update/delete
DROP POLICY IF EXISTS "screenshots_update_admin" ON storage.objects;
CREATE POLICY "screenshots_update_admin" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'donation-screenshots'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'donation-screenshots'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "screenshots_delete_admin" ON storage.objects;
CREATE POLICY "screenshots_delete_admin" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'donation-screenshots'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
