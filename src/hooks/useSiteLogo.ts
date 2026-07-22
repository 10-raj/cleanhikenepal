import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const DEFAULT_LOGO_URL =
  'https://cleanhikenepal.com/images/196/20503543/cleanHikenepallogo-PPWY3hOAc9-6vQ81N66zMw-zZ-kom6O7oLkwfBB8h7zHA.png';

/** Returns the admin-configured site logo URL, falling back to the
 * current default so the site looks identical until an admin sets one
 * via Settings. */
export function useSiteLogo() {
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

  useEffect(() => {
    let cancelled = false;
    async function fetchLogo() {
      try {
        const { data } = await supabase
          .from('website_settings')
          .select('site_logo_url')
          .limit(1)
          .maybeSingle();
        if (!cancelled && data?.site_logo_url) {
          setLogoUrl(data.site_logo_url);
        }
      } catch {
        // keep default
      }
    }
    fetchLogo();
    return () => { cancelled = true; };
  }, []);

  return logoUrl;
}
