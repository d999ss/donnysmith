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

  // Return streaming response that useChat expects
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  
  // Send the complete response as a single chunk
  res.write(`0:"${response.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`)
  res.write('d:""\n')
  res.end()
}