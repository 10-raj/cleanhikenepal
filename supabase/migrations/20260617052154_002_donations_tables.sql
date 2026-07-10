-- Create donation_campaigns table
CREATE TABLE IF NOT EXISTS donation_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  category VARCHAR(50) NOT NULL CHECK (category IN ('environmental', 'community', 'infrastructure', 'education')),
  image VARCHAR(500) NOT NULL,
  donors_count INTEGER DEFAULT 0,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donations table (individual donations)
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES donation_campaigns(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  donor_name VARCHAR(255),
  donor_email VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_category ON donation_campaigns(category);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON donation_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);

-- Enable RLS
ALTER TABLE donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donation_campaigns
CREATE POLICY "campaigns_select_policy" ON donation_campaigns
  FOR SELECT TO public USING (true);

CREATE POLICY "campaigns_insert_policy" ON donation_campaigns
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "campaigns_update_policy" ON donation_campaigns
  FOR UPDATE TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for donations
CREATE POLICY "donations_select_own" ON donations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "donations_insert_policy" ON donations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "donations_select_public" ON donations
  FOR SELECT TO public
  USING (is_anonymous = false);

-- Trigger for updated_at on campaigns
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON donation_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update campaign totals after donation
CREATE OR REPLACE FUNCTION update_campaign_totals()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.payment_status = 'completed' THEN
    UPDATE donation_campaigns
    SET current_amount = current_amount + NEW.amount,
        donors_count = donors_count + 1
    WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.payment_status != 'completed' AND NEW.payment_status = 'completed' THEN
    UPDATE donation_campaigns
    SET current_amount = current_amount + NEW.amount,
        donors_count = donors_count + 1
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update campaign on donation
CREATE TRIGGER update_campaign_on_donation
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_totals();