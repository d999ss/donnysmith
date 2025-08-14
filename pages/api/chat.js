export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    })

    // Add small delay to show thinking
    await new Promise(resolve => setTimeout(resolve, 800))
    
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

    // Stream the response
    res.write(response)
    res.end()
    
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message })
  }
}