-- Fix sponsors data: the original seed (008_seed_sponsors) inserted placeholder
-- sponsors that were never replaced with the site's real sponsors. This left the
-- Admin Panel managing a dataset that had nothing to do with what the business
-- actually wanted published, while the real sponsors only ever lived in the
-- static src/data/sponsors.ts fallback file.
--
-- This migration:
--   1. Unpublishes (is_active = false) all previously-seeded placeholder sponsors
--      instead of deleting them, so admins can still review/reuse/delete them
--      manually from the Admin Panel if desired.
--   2. Inserts the two real, currently-published sponsors as active rows.
--   3. Leaves everything else as unpublished, matching "Initially: only Nepal
--      Tour and Trek + German Exam Nepal published, all remaining unpublished".

UPDATE sponsors SET is_active = false WHERE is_active = true;

INSERT INTO sponsors (id, name, logo, website, tier, description, is_active, display_order)
VALUES
  (
    '33333333-3333-3333-3333-333333333401',
    'Nepal Tour and Trek',
    'https://cleanhikenepal.com/images/576/20527727/logosocial-bDsVBskhX3VtFDps2fjhpg.png',
    'https://nepaltourandtrek.com/',
    'platinum',
    'Supporting sustainable tourism development in Nepal.',
    true,
    1
  ),
  (
    '33333333-3333-3333-3333-333333333402',
    'German Exam Nepal',
    'https://cleanhikenepal.com/images/576/20511488/logogen-R2aApFn_dDr_gPbUHxdYAA.jpg',
    'https://germanexamnepal.com/',
    'gold',
    'Premium outdoor gear for adventurers worldwide.',
    true,
    2
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  logo = EXCLUDED.logo,
  website = EXCLUDED.website,
  tier = EXCLUDED.tier,
  description = EXCLUDED.description,
  is_active = true,
  display_order = EXCLUDED.display_order;
