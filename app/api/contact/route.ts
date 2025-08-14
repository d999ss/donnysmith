import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message, type } = await req.json()

    // In a real implementation, you'd send this to your email service
    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      name,
      email,
      company,
      message,
      type,
      timestamp: new Date().toISOString()
    })

    // Here you could:
    // - Send email via SendGrid/Resend/Nodemailer
    // - Save to database
    // - Add to CRM
    // - Send to Slack/Discord webhook
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact information received. Donny will respond within 24-48 hours.' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}