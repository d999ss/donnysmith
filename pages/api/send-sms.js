import twilio from 'twilio'

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { message, userMessage } = await req.json()
    
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    const smsMessage = await client.messages.create({
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
      to: process.env.MY_PHONE_NUMBER,
      body: `🤖 New chat on donnysmith.com\n\nUser: ${userMessage}\n\nTime: ${new Date().toLocaleString()}`
    })

    return new Response(JSON.stringify({ 
      success: true, 
      sid: smsMessage.sid 
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('SMS Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}