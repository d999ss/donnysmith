export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    const response = `$ echo "${userMessage}"
${userMessage}

$ whoami
Donny Smith - Brand strategist & digital designer

$ cat ~/status.txt
Available for projects! Specializing in:
• Brand strategy & visual identity
• AI-powered design workflows
• Digital product experiences

What can I help you build?`

    // Return proper streaming format that useChat expects
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    
    // Send response in AI SDK streaming format
    res.write(`0:${JSON.stringify(response)}\n`)
    res.write(`d:\n`)
    res.end()
    
  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ error: error.message })
  }
}