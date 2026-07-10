/*
# Seed default admin user

Creates the initial administrator account so the admin panel can be accessed.

Default credentials (change immediately in production):
  Email:    admin@cleanhike.com
  Password: CleanHike@2026

To change credentials, update the two constants below and re-run, OR create
a new user via Supabase Auth and set their user_profiles.role to 'admin'.
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
      crypt('CleanHike@2026', gen_salt('bf', 10)),
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
