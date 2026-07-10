-- Create hikes table
CREATE TABLE IF NOT EXISTS hikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  region VARCHAR(255) NOT NULL,
  difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Hard')),
  duration VARCHAR(100) NOT NULL,
  distance VARCHAR(100) NOT NULL,
  max_elevation INTEGER NOT NULL,
  best_season TEXT[] NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  image VARCHAR(500) NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  price DECIMAL(10,2) NOT NULL,
  group_size VARCHAR(50) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_hikes_difficulty ON hikes(difficulty);
CREATE INDEX IF NOT EXISTS idx_hikes_featured ON hikes(featured);
CREATE INDEX IF NOT EXISTS idx_hikes_region ON hikes(region);
CREATE INDEX IF NOT EXISTS idx_hikes_slug ON hikes(slug);

-- Enable RLS
ALTER TABLE hikes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, admin write
CREATE POLICY "hikes_select_policy" ON hikes
  FOR SELECT TO public USING (true);

CREATE POLICY "hikes_insert_policy" ON hikes
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "hikes_update_policy" ON hikes
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "hikes_delete_policy" ON hikes
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_hikes_updated_at
  BEFORE UPDATE ON hikes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();