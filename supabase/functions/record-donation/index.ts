// Import from npm package instead of remote URL
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Configurable via environment variables rather than hardcoded, so
// thresholds can be tuned without a code change/redeploy.
const RATE_LIMIT_MAX = Number(Deno.env.get("RATE_LIMIT_DONATION_MAX") ?? "5");
const RATE_LIMIT_WINDOW_SECONDS = Number(Deno.env.get("RATE_LIMIT_DONATION_WINDOW_SECONDS") ?? "300"); // 5 min

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Rate limit per client IP - moderate limit appropriate for a public,
  // unauthenticated endpoint.
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || req.headers.get("cf-connecting-ip")
    || "unknown";
  try {
    const { data: allowed, error: rateLimitError } = await supabase.rpc("check_rate_limit", {
      p_key: `record-donation:${clientIp}`,
      p_max_requests: RATE_LIMIT_MAX,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    });
    if (!rateLimitError && allowed === false) {
      return jsonResponse({ error: "Too many requests. Please try again shortly." }, 429);
    }
    // If the rate_limits table/function isn't set up yet, fail open
    // rather than blocking legitimate donations.
  } catch {
    // fail open
  }

  try {
    const payload: DonationPayload = await req.json();

    // Strict schema validation - reject anything that doesn't match,
    // rather than silently sanitizing/truncating.
    if (typeof payload.amount !== "number" || !Number.isFinite(payload.amount) || payload.amount <= 0 || payload.amount > 10_000_000) {
      return jsonResponse({ error: "Valid donation amount required" }, 400);
    }

    const validMethods = ["esewa", "khalti", "imepay", "connectips", "bank"];
    if (!payload.paymentMethod || !validMethods.includes(payload.paymentMethod.toLowerCase())) {
      return jsonResponse({ error: "Invalid payment method" }, 400);
    }

    if (!payload.screenshotUrl || typeof payload.screenshotUrl !== "string" || payload.screenshotUrl.length > 1000) {
      return jsonResponse({ error: "Payment screenshot is required" }, 400);
    }

    if (payload.name !== undefined && (typeof payload.name !== "string" || payload.name.length > 255)) {
      return jsonResponse({ error: "Invalid name" }, 400);
    }
    if (payload.email !== undefined && payload.email !== "" && (typeof payload.email !== "string" || payload.email.length > 255 || !EMAIL_RE.test(payload.email))) {
      return jsonResponse({ error: "Invalid email" }, 400);
    }
    if (payload.phone !== undefined && (typeof payload.phone !== "string" || payload.phone.length > 50)) {
      return jsonResponse({ error: "Invalid phone" }, 400);
    }
    if (payload.transactionId !== undefined && (typeof payload.transactionId !== "string" || payload.transactionId.length > 255)) {
      return jsonResponse({ error: "Invalid transaction ID" }, 400);
    }
    if (payload.remarks !== undefined && (typeof payload.remarks !== "string" || payload.remarks.length > 2000)) {
      return jsonResponse({ error: "Remarks too long" }, 400);
    }
    if (payload.message !== undefined && (typeof payload.message !== "string" || payload.message.length > 2000)) {
      return jsonResponse({ error: "Message too long" }, 400);
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
      return jsonResponse({ error: "Failed to record donation" }, 500);
    }

    return jsonResponse({ success: true, donation: data }, 200);
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
