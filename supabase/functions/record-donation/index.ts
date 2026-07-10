// Import from npm package instead of remote URL
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DonationPayload {
  name?: string;
  email?: string;
  phone?: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  remarks?: string;
  screenshotUrl?: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const payload: DonationPayload = await req.json();

    if (!payload.amount || payload.amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Valid donation amount required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validMethods = ["esewa", "khalti", "imepay", "connectips", "bank"];
    if (!payload.paymentMethod || !validMethods.includes(payload.paymentMethod.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: "Invalid payment method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Require screenshot proof
    if (!payload.screenshotUrl) {
      return new Response(
        JSON.stringify({ error: "Payment screenshot is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from("donations")
      .insert([{
        donor_name: payload.name || "Anonymous",
        donor_email: payload.email || null,
        donor_phone: payload.phone || null,
        amount: payload.amount,
        payment_method: payload.paymentMethod,
        transaction_id: payload.transactionId || null,
        remarks: payload.remarks || null,
        screenshot_url: payload.screenshotUrl,
        message: payload.message || null,
        payment_status: "pending",
        verification_status: "pending",
        is_anonymous: !payload.name,
      }])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to record donation" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, donation: data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
