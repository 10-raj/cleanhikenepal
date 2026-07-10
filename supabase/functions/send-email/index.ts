import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Email sending using Resend API (or any email service)
async function sendEmail(payload: ContactFormPayload): Promise<{ success: boolean; error?: string }> {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const CONTACT_EMAIL = Deno.env.get('CONTACT_EMAIL') || 'acharyaraj2005@gmail.com';

  // If no Resend API key, simulate success for development
  if (!RESEND_API_KEY) {
    console.log('No RESEND_API_KEY found. Simulating email send.');
    console.log(`Would send email to ${CONTACT_EMAIL}:`, payload);
    return { success: true };
  }

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
        subject: `New Contact Form: ${payload.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Subject:</strong> ${payload.subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${payload.message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!adminEmailResponse.ok) {
      const error = await adminEmailResponse.text();
      console.error('Failed to send admin email:', error);
      return { success: false, error: 'Failed to send notification email' };
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
          <p>Dear ${payload.name},</p>
          <p>We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
            ${payload.message.replace(/\n/g, '<br>')}
          </p>
          <br />
          <p>Best regards,<br />CleanHike Nepal Team</p>
        `,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: String(error) };
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const payload: ContactFormPayload = await req.json();

    // Validate required fields
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Rate limiting could be added here using IP or other methods

    // Send emails
    const result = await sendEmail(payload);

    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error || "Failed to send email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
