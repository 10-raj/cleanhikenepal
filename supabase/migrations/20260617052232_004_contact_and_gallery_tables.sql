-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  replied_at TIMESTAMPTZ,
  reply_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can insert, only admin can read/update
CREATE POLICY "contact_insert_policy" ON contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "contact_select_policy" ON contact_messages
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "contact_update_policy" ON contact_messages
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  src VARCHAR(500) NOT NULL,
  alt TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('hikes', 'nature', 'community', 'events')),
  location VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(is_active);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "gallery_select_policy" ON gallery
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "gallery_insert_policy" ON gallery
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "gallery_update_policy" ON gallery
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "gallery_delete_policy" ON gallery
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');