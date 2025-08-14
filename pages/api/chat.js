export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body || {}
    const userMessage = messages?.[messages.length - 1]?.content || 'test'
    
    // Add small delay to show thinking
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const response = `$ echo "${userMessage}"
${userMessage}

$ whoami
Donny Smith - Executive Creative Director
Bored Optimism™ | Park City, UT
@donnysmith on X | Joined February 2008

$ cat ~/company.txt
@makebttr - A Brand & Digital Experience Company
Helping ambitious teams design a better future.
makebttr.com

$ cat ~/philosophy.txt
"An object in motion stays in motion."

$ ls -la services/
drwxr-xr-x  brand-strategy/
drwxr-xr-x  digital-experiences/  
drwxr-xr-x  creative-direction/
drwxr-xr-x  team-consulting/

What ambitious project can we help you build?`

    // Just return the response as JSON like it was working before
    return res.json({
      id: 'demo-' + Date.now(),
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
      }]
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ error: error.message })
  }
}