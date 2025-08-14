import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, provider = 'gpt-4o-mini' } = req.body
    
    // Demo mode - simple working response
    if (!process.env.OPENAI_API_KEY) {
      const userMessage = messages[messages.length - 1]?.content || 'hello'
      
      let response = `$ whoami
Donny Smith - Brand strategist & AI enthusiast

$ echo "Thanks for your message: ${userMessage}"
Thanks for your message: ${userMessage}

$ cat ~/services.txt
• Brand strategy & visual identity
• AI-powered design workflows
• Digital product experiences

How can I help you today?`

      // Simple successful response
      return res.json({
        id: 'demo-123',
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
        }]
      })
    }

    // Real AI when API key is available
    const result = await streamText({
      model: openai(provider),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    })
  }
}