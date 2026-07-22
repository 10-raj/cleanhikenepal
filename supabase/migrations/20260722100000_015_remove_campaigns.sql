/*
  # Remove Campaigns feature

  The "Campaigns" admin module and its donation_campaigns table are no longer
  used anywhere in the app (donations are no longer associated with a
  campaign). This migration removes the dependent column on `donations`
  and drops the `donation_campaigns` table.

  Existing donation records are preserved; only the unused campaign_id
  reference column is dropped.
*/

ALTER TABLE IF EXISTS donations DROP COLUMN IF EXISTS campaign_id;

DROP TABLE IF EXISTS donation_campaigns CASCADE;
