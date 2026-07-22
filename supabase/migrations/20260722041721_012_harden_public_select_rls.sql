/*
# Harden public RLS on completed_hikes and donation_campaigns

## Problem
Both tables already have a working publish/unpublish concept
(completed_hikes.is_active, donation_campaigns.status) and the public
pages already filter correctly in application code
(.eq('is_active', true) / .eq('status', 'active')) - so unpublishing
works correctly in the app today. But their public SELECT policies
were left as `USING (true)`, unlike every other publishable table
(hikes, gallery, sponsors, hero_banners, team_members), which enforce
this at the database level. Any direct anon-key query bypassing the
app's own filter would currently see unpublished/paused rows. This
brings both tables in line with the rest of the schema.

## Changes
- completed_hikes: public can only SELECT is_active = true rows
- donation_campaigns: public can only SELECT status = 'active' rows
- Admins keep full visibility via the existing user_profiles.role
  check, matching every other admin-managed table
*/

DROP POLICY IF EXISTS "public_read_completed_hikes" ON completed_hikes;

CREATE POLICY "completed_hikes_select_public" ON completed_hikes FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "completed_hikes_select_admin" ON completed_hikes FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "campaigns_select_policy" ON donation_campaigns;

CREATE POLICY "campaigns_select_public" ON donation_campaigns FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "campaigns_select_admin" ON donation_campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
