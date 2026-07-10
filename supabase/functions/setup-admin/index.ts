import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

/**
 * Setup Admin Edge Function
 *
 * Creates or updates the admin user through GoTrue's Auth Admin API.
 * Call this endpoint (POST, no auth required) to create/reset the admin user.
 *
 * To change admin credentials:
 *   1. Edit ADMIN_EMAIL and ADMIN_PASSWORD below
 *   2. Redeploy this function
 *   3. Call: curl -X POST <your-supabase-url>/functions/v1/setup-admin
 *
 * Or simply change the password in the Supabase Dashboard → Authentication → Users.
 */

const ADMIN_EMAIL = "admin@cleanhike.com";
const ADMIN_PASSWORD = "CleanHike@2026";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // Check if admin user already exists
    const { data: listData } = await supabase.auth.admin.listUsers();
    const existing = listData?.users?.find((u: any) => u.email === ADMIN_EMAIL);

    if (existing) {
      // Update password and ensure email is confirmed
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existing.id,
        {
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { name: "Admin", role: "admin" },
        }
      );

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "updateUserById failed: " + updateError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Ensure user_profiles has admin role
      await supabase
        .from("user_profiles")
        .upsert({
          id: existing.id,
          name: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        }, { onConflict: "id" });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin password updated successfully",
          email: ADMIN_EMAIL,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new admin user
    const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: "Admin", role: "admin" },
    });

    if (createError) {
      return new Response(
        JSON.stringify({ error: "createUser failed: " + createError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure user_profiles has admin role
    if (newUserData?.user?.id) {
      await supabase
        .from("user_profiles")
        .upsert({
          id: newUserData.user.id,
          name: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        }, { onConflict: "id" });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        email: ADMIN_EMAIL,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return new Response(
      JSON.stringify({ error: "Exception: " + String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
