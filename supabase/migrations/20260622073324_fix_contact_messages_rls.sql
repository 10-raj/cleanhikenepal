-- Fix contact_messages INSERT policy to allow anonymous submissions
-- Drop the restrictive policy
DROP POLICY IF EXISTS "contact_insert_policy" ON contact_messages;

-- Create new policy that allows anonymous inserts
CREATE POLICY "contact_insert_anonymous" ON contact_messages
  FOR INSERT WITH CHECK (true);