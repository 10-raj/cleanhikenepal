-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(500) NOT NULL,
  website VARCHAR(500),
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);

-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "sponsors_select_policy" ON sponsors
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "sponsors_insert_policy" ON sponsors
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sponsors_update_policy" ON sponsors
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sponsors_delete_policy" ON sponsors
  FOR DELETE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger for updated_at
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();