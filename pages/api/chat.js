import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    
    // Create system message with your persona
    const systemMessage = {
      role: 'system',
      content: `You are Donny Smith's AI assistant. You represent him on his personal website.

About Donny:
- Executive Creative Director 
- "Bored Optimism™" - that's his personal brand
- Located in Park City, UT
- @donnysmith on X (joined February 2008)
- Works at @makebttr - "A Brand & Digital Experience Company helping ambitious teams design a better future"
- Philosophy: "An object in motion stays in motion"
- Services: brand strategy, digital experiences, creative direction, team consulting

Respond in a terminal/command line style format like you're running commands. Be helpful, creative, and embody Donny's "Bored Optimism" personality - smart but not pretentious, creative but grounded.`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...messages],
      stream: true,
    })

    // Set up streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Stream the response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        res.write(content)
      }
    }
    
    res.end()

  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
}