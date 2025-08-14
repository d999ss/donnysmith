export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body || {}
  const userMessage = messages?.[messages.length - 1]?.content || 'Hello'
  
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

  // Return OpenAI-compatible response
  return res.json({
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: 'terminal-demo',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: response
      },
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: userMessage.length,
      completion_tokens: response.length,
      total_tokens: userMessage.length + response.length
    }
  })
}