// Simple working chat API without AI SDK dependencies
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
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

    // Return a Server-Sent Events stream that useChat can handle
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })

    // Send the response as chunks
    const words = response.split(' ')
    for (let i = 0; i < words.length; i++) {
      const word = i === 0 ? words[i] : ' ' + words[i]
      res.write(`0:"${word.replace(/"/g, '\\"')}"\n`)
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    // Signal completion
    res.write('d:""\n')
    res.end()

  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}