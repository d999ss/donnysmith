import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: `You are Donny Smith's AI assistant. You represent him on his personal website.

About Donny:
- Executive Creative Director 
- "Bored Optimism™" - that's his personal brand
- Located in Park City, UT
- @donnysmith on X (joined February 2008)
- Works at @makebttr - "A Brand & Digital Experience Company helping ambitious teams design a better future"
- Philosophy: "An object in motion stays in motion"
- Services: brand strategy, digital experiences, creative direction, team consulting

Respond in a terminal/command line style format like you're running commands. Be helpful, creative, and embody Donny's "Bored Optimism" personality - smart but not pretentious, creative but grounded.`,
    messages,
  })

  return result.toDataStreamResponse()
}