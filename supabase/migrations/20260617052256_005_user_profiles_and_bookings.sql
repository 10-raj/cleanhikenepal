-- Create user_profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  avatar VARCHAR(500),
  phone VARCHAR(50),
  country VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'guide', 'admin')),
  bio TEXT,
  total_donations DECIMAL(10,2) DEFAULT 0,
  hikes_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_role ON user_profiles(role);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "profiles_select_own" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_public" ON user_profiles
  FOR SELECT TO public
  USING (true);

CREATE POLICY "profiles_insert_policy" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create ai_chat_logs table (for future analytics)
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  matched_faq BOOLEAN DEFAULT false,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_chat_session ON ai_chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON ai_chat_logs(created_at DESC);

-- Enable RLS
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "chatlogs_insert_policy" ON ai_chat_logs
  FOR INSERT TO public WITH CHECK (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create trek_bookings table (for future booking system)
CREATE TABLE IF NOT EXISTS trek_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hike_id UUID REFERENCES hikes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  number_of_participants INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_bookings_hike ON trek_bookings(hike_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON trek_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON trek_bookings(status);

-- Enable RLS
ALTER TABLE trek_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "bookings_select_own" ON trek_bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_insert_policy" ON trek_bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "bookings_update_own" ON trek_bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_admin_policy" ON trek_bookings
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON trek_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();