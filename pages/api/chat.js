import { streamText } from 'ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    const userMessage = messages?.[messages.length - 1]?.content || 'Hello'
    
    // Create a simple streaming response using streamText with a mock provider
    const result = await streamText({
      model: {
        provider: 'demo',
        modelId: 'demo-terminal',
        doGenerate: async () => {
          const response = `$ echo "Message received: ${userMessage}"
Message received: ${userMessage}

$ whoami  
Donny Smith - Brand strategist & digital designer

$ cat ~/status.txt
Available for projects! Specializing in:
• Brand strategy & visual identity
• AI-powered design workflows
• Digital product experiences

What can I help you build?`

          return {
            text: response,
            finishReason: 'stop',
            usage: { promptTokens: 0, completionTokens: response.length }
          }
        }
      },
      prompt: userMessage
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}