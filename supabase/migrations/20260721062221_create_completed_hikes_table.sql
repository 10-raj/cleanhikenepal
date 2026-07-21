/*
# Create completed_hikes table

## Purpose
Stores records of completed clean hike events so they can be managed from the admin panel
and displayed on the homepage "Completed Hikes" section. Replaces the previous static
hardcoded array in src/data/completedHikes.ts.

## New Tables
- `completed_hikes`
  - `id` (uuid, primary key)
  - `name` (text, not null) — hike name
  - `location` (text, not null) — where the hike took place
  - `elevation` (text) — elevation reached
  - `distance` (text) — distance covered
  - `duration` (text) — duration of the hike
  - `difficulty` (text, not null) — Easy | Moderate | Challenging | Hard
  - `completed_date` (date, not null) — date the hike was completed
  - `image` (text) — URL of the hike photo
  - `description` (text) — short description
  - `highlights` (text[]) — array of highlight strings
  - `display_order` (integer, default 0) — sort order
  - `is_active` (boolean, default true) — whether to show on the public site
  - `created_at` (timestamptz, default now())

## Security
- RLS enabled on `completed_hikes`.
- Public read access for anon + authenticated (the completed hikes are shown on the public homepage).
- Only authenticated admins can insert / update / delete (admin panel is behind sign-in).

## Notes
1. This is a single-tenant public-content table — completed hikes are visible to everyone.
2. Admin write operations are gated by the admin auth flow already in place.
*/

CREATE TABLE IF NOT EXISTS completed_hikes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  elevation text,
  distance text,
  duration text,
  difficulty text NOT NULL DEFAULT 'Easy',
  completed_date date NOT NULL,
  image text,
  description text,
  highlights text[] DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE completed_hikes ENABLE ROW LEVEL SECURITY;

-- Public read
DROP POLICY IF EXISTS "public_read_completed_hikes" ON completed_hikes;
CREATE POLICY "public_read_completed_hikes" ON completed_hikes FOR SELECT
  TO anon, authenticated USING (true);

-- Admin insert
DROP POLICY IF EXISTS "admin_insert_completed_hikes" ON completed_hikes;
CREATE POLICY "admin_insert_completed_hikes" ON completed_hikes FOR INSERT
  TO authenticated WITH CHECK (true);

-- Admin update
DROP POLICY IF EXISTS "admin_update_completed_hikes" ON completed_hikes;
CREATE POLICY "admin_update_completed_hikes" ON completed_hikes FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Admin delete
DROP POLICY IF EXISTS "admin_delete_completed_hikes" ON completed_hikes;
CREATE POLICY "admin_delete_completed_hikes" ON completed_hikes FOR DELETE
  TO authenticated USING (true);

-- Seed existing completed hikes from the static data
INSERT INTO completed_hikes (name, location, elevation, distance, duration, difficulty, completed_date, image, description, highlights, display_order, is_active)
VALUES
  (
    'Champadevi Region',
    'Dakshinkali, Kathmandu',
    '2,285 meters',
    '3,500 meters',
    '3-4 hours',
    'Moderate',
    '2026-02-28',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR67CuDVUh4jlaydFQ5MWGY5Ovut9XGo5Da3fS9I8sNG-h93_lL-hHS5iQo&s=10',
    'A peaceful ridge hike through fragrant pine forests to a sacred summit overlooking the Kathmandu Valley.',
    ARRAY['Himalayan Ridge Panorama', 'Dual Faith Shrine', 'Pine Forest Canopy'],
    1,
    true
  ),
  (
    'Chapakharka Trail',
    'Godawari, Lalitpur',
    '1,980 meters',
    '4,200 meters',
    '3-4 hours',
    'Moderate',
    '2026-03-28',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4iaB1Hb8xEkBRFIsgzk0tfGHOjJp79pqrba0XeenHX1TpnVo4BLvo_sQ&s=10',
    'A gentle mountain escape leading to rolling grassy clearings and panoramic paragliding viewpoints high above Godawari.',
    ARRAY['Phulchoki Range Vistas', 'Paragliding Takeoff Zone', 'Lush Botanical Foothills'],
    2,
    true
  ),
  (
    'Tarebhir Region, Trail',
    'Gokarneshwor, Kathmandu',
    '1,820 meters',
    '4,500 meters',
    '3-4 hours',
    'Easy',
    '2026-05-30',
    'https://trekwaysnepal.com/images/main/Fri-08-31-15-1112364885-tare-vir.webp',
    'A scenic cliffside trek skirting the national park boundary to a traditional Tamang village overlooking the entire city.',
    ARRAY['Dramatic Cliffside Views', 'Shivapuri Forest Canopy', 'Tamang Cultural Heritage'],
    3,
    true
  ),
  (
    'Bhundole Chaur Trail',
    'Pharping, Kathmandu',
    '1,850 meters',
    '4,000 meters',
    '2-3 hours',
    'Easy',
    '2026-06-20',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4BkidsygU6olIU8BU19i7beyROPDHB8ERLoFcl_4MtH45bKIUG9b4pgvH&s=10',
    'A refreshing walk through pine-scented hills leading to an expansive, hidden meadow popular for camping and picnics.',
    ARRAY['Vast Green Meadow', 'Pharping Pine Woodlands', 'Serene Picnic Clearings'],
    4,
    true
  )
ON CONFLICT DO NOTHING;
