-- Add new contact form fields to contact_messages table
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS next_hike_location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS number_of_members INTEGER,
  ADD COLUMN IF NOT EXISTS how_heard VARCHAR(100),
  ADD COLUMN IF NOT EXISTS hike_join_date DATE;

-- Add next hike info to website_settings (admin-editable)
ALTER TABLE website_settings
  ADD COLUMN IF NOT EXISTS next_hike_name VARCHAR(255) DEFAULT 'Community Clean Hike',
  ADD COLUMN IF NOT EXISTS next_hike_location VARCHAR(255) DEFAULT 'Champadevi Trail, Dakshinkali',
  ADD COLUMN IF NOT EXISTS next_hike_date VARCHAR(100) DEFAULT 'Every Saturday Morning',
  ADD COLUMN IF NOT EXISTS next_hike_description TEXT DEFAULT 'Join us for our weekly community clean hike. We meet at the trailhead, hike together, and clean up along the way. All are welcome!';
