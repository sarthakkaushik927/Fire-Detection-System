import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import nodemailer from "npm:nodemailer@6.9.7" 

const GMAIL_USER = Deno.env.get('GMAIL_USER')
const GMAIL_PASS = Deno.env.get('GMAIL_PASS')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
})

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, description, type, status, id, lat, lng } = await req.json()

    // --- 1. PREPARE EMAIL CONTENT ---
    let htmlContent = ''
    let emailSubject = subject

    if (type === 'confirmation') {
        emailSubject = `🔥 FireWatch: Report Received`
        htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #f97316;">FireWatch Report Received</h2>
            <p><strong>Reference ID:</strong> #${id || 'PENDING'}</p>
            <p>Thank you. Your report has been logged and is being analyzed by our AI.</p>
            <hr style="border:0; border-top:1px solid #eee; margin: 15px 0;">
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${lat},${lng}">View on Map</a></p>
          </div>
        `
    } else {
        // ALERT / UPDATE
        const isDanger = status === 'VERIFIED_DANGER' || status === 'verified'
        emailSubject = isDanger ? `⚠️ DANGER: Fire Detected at Report #${id}` : `✅ SAFE: Report #${id} Cleared`
        const color = isDanger ? '#dc2626' : '#16a34a'
        
        htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 4px solid ${color}; border-radius: 8px;">
            <h1 style="color: ${color}; margin-top:0;">${isDanger ? '⚠️ DANGER CONFIRMED' : '✅ SAFE NOTICE'}</h1>
            <p><strong>Status Update for Report #${id}</strong></p>
            <p style="font-size: 16px;">${description}</p>
            ${isDanger ? `<p style="color:red; font-weight:bold;">DRONES DISPATCHED TO COORDINATES.</p>` : ''}
          </div>
        `
    }

    // --- 2. SEND VIA GMAIL ---
    console.log(`📨 Sending via Gmail to: ${to}`)
    
    const info = await transporter.sendMail({
      from: `"FireWatch Admin" <${GMAIL_USER}>`, 
      to: to, // ✅ This will now work for ANY email address
      subject: emailSubject,
      html: htmlContent,
    })

    console.log("✅ Email sent successfully:", info.messageId)

    return new Response(JSON.stringify({ success: true, id: info.messageId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("❌ Gmail Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})