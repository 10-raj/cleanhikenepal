/*
# Seed default admin user

Creates the initial administrator account so the admin panel can be
accessed. This migration has already run against your live database
(it's idempotent - re-running it is a no-op if the account exists).

SECURITY NOTE: This file previously contained a hardcoded plaintext
password, committed to a public GitHub repo. That password should be
treated as permanently compromised - if the admin@cleanhike.com
account is still in use, rotate its password immediately via
Supabase Dashboard -> Authentication -> Users -> find the account ->
reset password. Note that scrubbing this file does not remove the
old password from git's commit history - only rotating the actual
Supabase password neutralizes the exposure.

The password below is a placeholder only. If you need to (re-)seed
this account, replace REPLACE_WITH_STRONG_PASSWORD with a real,
unique password before running - and never commit that value.
*/

DO $$
DECLARE
  admin_email TEXT := 'admin@cleanhike.com';
  admin_uuid UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    admin_uuid := gen_random_uuid();

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data
    ) VALUES (
      admin_uuid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      admin_email,
      crypt('REPLACE_WITH_STRONG_PASSWORD', gen_salt('bf', 10)),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin","role":"admin"}'
    );

    INSERT INTO auth.identities (
      provider_id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      admin_uuid::text,
      admin_uuid,
      jsonb_build_object('sub', admin_uuid::text, 'email', admin_email),
      'email',
      NOW(), NOW(), NOW()
    );

    INSERT INTO user_profiles (id, name, email, role)
    VALUES (admin_uuid, 'Admin', admin_email, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;
  ELSE
    SELECT id INTO admin_uuid FROM auth.users WHERE email = admin_email;
    INSERT INTO user_profiles (id, name, email, role)
    VALUES (admin_uuid, 'Admin', admin_email, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = EXCLUDED.email;
  END IF;
END $$;
