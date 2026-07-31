/**
 * Admin credentials & configuration.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * WHERE TO CHANGE ADMIN CREDENTIALS
 * ──────────────────────────────────────────────────────────────────────────
 * The admin account is a real Supabase Auth user — the password is NOT
 * stored in frontend code and never should be.
 *
 * To change the admin login, use ONE of these methods:
 *
 * METHOD 1 — Change in Supabase Dashboard (easiest):
 *   Go to your Supabase project → Authentication → Users
 *   Find the admin account → click → change password
 *
 * METHOD 2 — Promote a new account to admin:
 *   1. Sign up a new user at /admin/login (or via Supabase dashboard)
 *   2. Run this SQL to grant admin role:
 *      UPDATE user_profiles SET role = 'admin' WHERE email = 'your@email.com';
 *
 * Optional env overrides (set in .env, never committed):
 *   VITE_ADMIN_EMAIL  — the email that gets auto-promoted to admin on first
 *                        login (see AuthContext.tsx), and shown as the
 *                        default placeholder on the login form
 *   VITE_ADMIN_HINT   — a hint shown under the login form (optional)
 * ──────────────────────────────────────────────────────────────────────────
 */

export const ADMIN_CONFIG = {
  /** Default email shown as a placeholder on the login screen. */
  defaultEmail: import.meta.env.VITE_ADMIN_EMAIL || '',
  /** Optional hint displayed under the login form. */
  hint: import.meta.env.VITE_ADMIN_HINT || '',
  /** Route the admin area lives under. */
  adminBasePath: '/admin',
} as const;
