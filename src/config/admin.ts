/**
 * Admin credentials & configuration.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHERE TO CHANGE ADMIN CREDENTIALS
 * ──────────────────────────────────────────────────────────────────────────
 * The admin account is a real Supabase Auth user — the password is NOT
 * stored in frontend code. The initial admin user is created via GoTrue's
 * signup API (not manual SQL insert) to ensure password hash compatibility.
 *
 * To change the admin login, use ONE of these methods:
 *
 * METHOD 1 — Change in Supabase Dashboard (easiest):
 *   Go to your Supabase project → Authentication → Users
 *   Find admin@cleanhike.com → click → change password
 *
 * METHOD 2 — Use the Auth Admin API via an edge function:
 *   Call the setup-admin edge function (already deployed) with updated
 *   email/password constants in supabase/functions/setup-admin/index.ts
 *
 * METHOD 3 — Create a new admin user:
 *   1. Sign up a new user at /admin/login (or via Supabase dashboard)
 *   2. Run this SQL to grant admin role:
 *      UPDATE user_profiles SET role = 'admin' WHERE email = 'your@email.com';
 *
 * ──────────────────────────────────────────────────────────────────────────
 * DEFAULT ADMIN CREDENTIALS (change immediately in production):
 *   Email:    admin@cleanhike.com
 *   Password: CleanHike@2026
 *
 * Optional env overrides (set in .env):
 *   VITE_ADMIN_EMAIL  — shown as the default email placeholder on login form
 *   VITE_ADMIN_HINT   — a hint shown under the login form (optional)
 * ──────────────────────────────────────────────────────────────────────────
 */

export const ADMIN_CONFIG = {
  /** Default email shown as a placeholder on the login screen. */
  defaultEmail: import.meta.env.VITE_ADMIN_EMAIL || 'admin@cleanhike.com',
  /** Optional hint displayed under the login form. */
  hint: import.meta.env.VITE_ADMIN_HINT || '',
  /** Route the admin area lives under. */
  adminBasePath: '/admin',
} as const;
