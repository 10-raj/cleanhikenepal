/*
# Create admin-images storage bucket

## Purpose
Allows admin users to upload images directly from their computer (hike photos,
gallery images, sponsor logos) instead of pasting an external URL. Uploaded
files are stored in Supabase Storage and served via public URLs.

## Changes
1. Creates a public storage bucket `admin-images` (public-read so the website
   can display uploaded images without auth).
2. RLS policies on `storage.objects`:
   - Public SELECT for the `admin-images` bucket (anyone can view images).
   - Authenticated INSERT/UPDATE/DELETE restricted to admin users (verified via
     `user_profiles.role = 'admin'`), matching the existing admin RLS pattern.

## Security
- Only authenticated admins can upload, replace, or delete images.
- Public read is intentional — these images are displayed on the public website.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-images', 'admin-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
DROP POLICY IF EXISTS "admin_images_public_read" ON storage.objects;
CREATE POLICY "admin_images_public_read" ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'admin-images');

-- Admin insert
DROP POLICY IF EXISTS "admin_images_insert_admin" ON storage.objects;
CREATE POLICY "admin_images_insert_admin" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'admin-images'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin update
DROP POLICY IF EXISTS "admin_images_update_admin" ON storage.objects;
CREATE POLICY "admin_images_update_admin" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'admin-images'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'admin-images'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin delete
DROP POLICY IF EXISTS "admin_images_delete_admin" ON storage.objects;
CREATE POLICY "admin_images_delete_admin" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'admin-images'
    AND EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
