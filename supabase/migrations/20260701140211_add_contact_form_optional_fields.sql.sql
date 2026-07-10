-- Add optional fields to contact_messages for volunteer/partner inquiries
ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS purpose VARCHAR(50) DEFAULT 'general'
    CHECK (purpose IN ('general', 'volunteer', 'partner', 'donation', 'booking')),
  ADD COLUMN IF NOT EXISTS interest VARCHAR(100),
  ADD COLUMN IF NOT EXISTS partner_type VARCHAR(100);

-- Index for filtering by purpose in the admin dashboard
CREATE INDEX IF NOT EXISTS idx_contact_purpose ON contact_messages(purpose);
