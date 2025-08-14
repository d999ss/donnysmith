import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
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
        },
        ...messages
      ],
    })

    return result.toDataStreamResponse()

  } catch (error) {
    console.error('Chat API error:', error)
    return res.status(500).json({ error: 'Failed to generate response' })
  }
}