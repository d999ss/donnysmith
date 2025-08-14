import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export default async function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Always return demo response for now to test
    const { messages } = req.body
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    const response = `$ echo "Hello! You said: ${userMessage}"\nHello! You said: ${userMessage}\n\n$ whoami\nDonny Smith - Brand strategist\n\nThis is a simple test response to verify the API is working.`

    return res.json({
      id: 'demo-' + Date.now(),
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'demo',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: response
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 20,
        total_tokens: 30
      }
    })
    
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: 'API Error',
      message: error.message 
    })
  }
}