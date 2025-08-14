export default async function handler(req, res) {
  console.log('Chat API called:', req.method, req.body)
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    console.log('Processing message:', userMessage)
    
    // Simple delay to show it's working
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const response = `$ echo "${userMessage}"
${userMessage}

$ whoami
Donny Smith - Brand strategist

This is a test response. The chat is working!`

    console.log('Sending response:', response.substring(0, 50) + '...')

    // Return the simplest possible format
    return res.status(200).json({
      role: 'assistant',
      content: response
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ error: error.message })
  }
}