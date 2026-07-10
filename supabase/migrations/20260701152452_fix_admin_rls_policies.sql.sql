/*
# Fix admin RLS policies to check user_profiles instead of JWT role

## Problem
The existing admin RLS policies on contact_messages, trek_bookings, and donations
used `auth.jwt() ->> 'role' = 'admin'`. Supabase JWTs set `role` to the Postgres
role name (`authenticated`), NOT the app-level admin role stored in user_profiles.
This means no authenticated user could ever satisfy the policy, so all admin
queries returned empty results `{}`.

## Changes
1. contact_messages — replace SELECT and UPDATE admin policies to check
   `user_profiles.role = 'admin'` via a subquery on auth.uid().
2. trek_bookings — replace the `FOR ALL` admin policy with a proper admin
   SELECT/UPDATE policy checking user_profiles.role. Keep the existing
   owner-scoped SELECT/UPDATE/INSERT policies for regular users.
3. donations — add an admin SELECT policy (there was none, so admins could
   not view donations at all). Keep existing public/owner SELECT policies.

## Security
- All admin policies now verify `EXISTS (SELECT 1 FROM user_profiles WHERE
  id = auth.uid() AND role = 'admin')`.
- Owner-scoped policies for regular users are preserved.
- Public read of non-anonymous donations is preserved.
*/

-- 1. contact_messages: replace broken JWT-based admin policies
DROP POLICY IF EXISTS "contact_select_policy" ON contact_messages;
DROP POLICY IF EXISTS "contact_update_policy" ON contact_messages;

CREATE POLICY "contact_select_admin" ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "contact_update_admin" ON contact_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. trek_bookings: replace broken JWT-based admin FOR ALL policy
DROP POLICY IF EXISTS "bookings_admin_policy" ON trek_bookings;

CREATE POLICY "bookings_select_admin" ON trek_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "bookings_update_admin" ON trek_bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. donations: add admin SELECT policy (was missing entirely)
DROP POLICY IF EXISTS "donations_select_admin" ON donations;

CREATE POLICY "donations_select_admin" ON donations FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
