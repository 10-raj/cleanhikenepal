import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Configurable via environment variables rather than hardcoded.
const RATE_LIMIT_MAX = Number(Deno.env.get("RATE_LIMIT_EMAIL_MAX") ?? "5");
const RATE_LIMIT_WINDOW_SECONDS = Number(Deno.env.get("RATE_LIMIT_EMAIL_WINDOW_SECONDS") ?? "300"); // 5 min

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Prevent HTML injection into the email body - user-supplied text was
// previously interpolated directly into HTML with no escaping.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Email sending using Resend API (or any email service)
async function sendEmail(payload: ContactFormPayload): Promise<{ success: boolean }> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const CONTACT_EMAIL = Deno.env.get('CONTACT_EMAIL') || 'acharyaraj2005@gmail.com';

  // If no Resend API key, simulate success for development
  if (!RESEND_API_KEY) {
    console.log('No RESEND_API_KEY found. Simulating email send.');
    console.log(`Would send email to ${CONTACT_EMAIL}:`, payload);
    return { success: true };
  }

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br>');

  try {
    // Send notification email to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CleanHike Nepal <noreply@cleanhike.com>',
        to: CONTACT_EMAIL,
        subject: `New Contact Form: ${safeSubject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text();
      console.error('Failed to send admin email:', error);
      return { success: false };
    }

    // Send confirmation email to user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CleanHike Nepal <noreply@cleanhike.com>',
        to: payload.email,
        subject: `Thank you for contacting CleanHike Nepal`,
        html: `
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${safeName},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${safeMessage}
          </p>
          <br />
          <p>Best regards,<br />CleanHike Nepal Team</p>
        `,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // Rate limit per client IP.
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
    || req.headers.get("cf-connecting-ip")
    || "unknown";
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data: allowed, error: rateLimitError } = await supabase.rpc("check_rate_limit", {
        p_key: `send-email:${clientIp}`,
        p_max_requests: RATE_LIMIT_MAX,
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
      });
      if (!rateLimitError && allowed === false) {
        return jsonResponse({ error: "Too many requests. Please try again shortly." }, 429);
      }
    }
    // If not configured, fail open rather than blocking legitimate messages.
  } catch {
    // fail open
  }

  try {
    const payload: ContactFormPayload = await req.json();

    // Strict schema validation - reject anything that doesn't match.
    if (
      typeof payload.name !== "string" || !payload.name.trim() || payload.name.length > 255 ||
      typeof payload.email !== "string" || !payload.email.trim() || payload.email.length > 255 ||
      typeof payload.subject !== "string" || !payload.subject.trim() || payload.subject.length > 500 ||
      typeof payload.message !== "string" || !payload.message.trim() || payload.message.length > 5000
    ) {
      return jsonResponse({ error: "All fields are required and must be valid" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return jsonResponse({ error: "Invalid email address" }, 400);
    }

    const result = await sendEmail(payload);

    if (!result.success) {
      // Generic message to the client; full detail already logged
      // server-side inside sendEmail() via console.error.
      return jsonResponse({ error: "Failed to send email" }, 500);
    }

    return jsonResponse({ success: true, message: "Email sent successfully" }, 200);
  } catch (error) {
    console.error("Error processing request:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
