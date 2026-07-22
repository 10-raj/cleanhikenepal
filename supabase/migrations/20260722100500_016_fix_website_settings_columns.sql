/*
  # Fix Homepage Manager: Featured Photo/Video & Statistics

  ## Root cause
  `website_settings` was missing columns that the admin Settings form and
  several public sections (HeroSection, AboutSection, FeaturedPhotoSection,
  FeaturedVideoSection, ContactSection) already read/write in application
  code. Every admin save for Featured Photo, Featured Video, Statistics,
  and most Next Clean Hike fields was failing with "column does not exist",
  and public pages were silently falling back to hardcoded defaults.

  ## Changes
  1. Add missing `featured_photo_*` columns (image, title, description, link)
  2. Add missing `featured_video_*` columns (url, title, description)
  3. Add missing `stat_*` columns actually used on the site (completed
     hikes, volunteers, waste collected, partner organizations)
  4. Add missing `next_hike_*` columns (time, meeting_point, difficulty,
     registration_link, map_url, image)
  5. Drop legacy `stat_donors`, `stat_raised`, `stat_projects`, `stat_regions`
     columns — unused dead fields, nothing on the site reads them (Donate
     page stats are hardcoded, not fetched from settings)

  ## Security
  No RLS policy changes — website_settings already has public read / admin
  write policies in place.
*/

ALTER TABLE website_settings
  ADD COLUMN IF NOT EXISTS featured_photo_image VARCHAR(500),
  ADD COLUMN IF NOT EXISTS featured_photo_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS featured_photo_description TEXT,
  ADD COLUMN IF NOT EXISTS featured_photo_link VARCHAR(255),
  ADD COLUMN IF NOT EXISTS featured_video_url VARCHAR(500),
  ADD COLUMN IF NOT EXISTS featured_video_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS featured_video_description TEXT,
  ADD COLUMN IF NOT EXISTS stat_completed_hikes VARCHAR(50) DEFAULT '5+',
  ADD COLUMN IF NOT EXISTS stat_volunteers VARCHAR(50) DEFAULT '50+',
  ADD COLUMN IF NOT EXISTS stat_waste_collected VARCHAR(50) DEFAULT '200kg',
  ADD COLUMN IF NOT EXISTS stat_partners VARCHAR(50) DEFAULT '10+',
  ADD COLUMN IF NOT EXISTS next_hike_time VARCHAR(50),
  ADD COLUMN IF NOT EXISTS next_hike_meeting_point VARCHAR(255),
  ADD COLUMN IF NOT EXISTS next_hike_difficulty VARCHAR(50) DEFAULT 'Moderate',
  ADD COLUMN IF NOT EXISTS next_hike_registration_link VARCHAR(500),
  ADD COLUMN IF NOT EXISTS next_hike_map_url VARCHAR(1000),
  ADD COLUMN IF NOT EXISTS next_hike_image VARCHAR(500);

ALTER TABLE website_settings
  DROP COLUMN IF EXISTS stat_donors,
  DROP COLUMN IF EXISTS stat_raised,
  DROP COLUMN IF EXISTS stat_projects,
  DROP COLUMN IF EXISTS stat_regions;
