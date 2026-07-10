-- Fix handle_new_user trigger to be resilient — don't block auth user creation
-- if the user_profiles insert fails for any reason.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  BEGIN
    INSERT INTO user_profiles (id, name, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      role = EXCLUDED.role;
  EXCEPTION WHEN OTHERS THEN
    -- Log but don't fail the auth user creation
    RAISE NOTICE 'Failed to create user_profile: %', SQLERRM;
  END;
  RETURN NEW;
END;
$function$;
