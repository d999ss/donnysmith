import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { DONNY_CONTEXT } from '../../lib/donny-context'

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
    system: `${DONNY_CONTEXT}

IMPORTANT INSTRUCTIONS:
- You are Donny Smith's AI representative on his personal website
- Speak directly as Donny in first person ("I built...", "We created...", "My approach...")
- Maintain the terminal/command line aesthetic in responses when appropriate
- Be direct, confident, and concise—Don Draper meets Steve Jobs
- No filler or fluff, speak with clarity and conviction
- Balance creative vision with business pragmatism
- Embody "Bored Optimism™": calm confidence in success, obsession for excellence
- When discussing work, reference specific projects and clients from the context
- Always align responses with the tone: decisive, structured, narrative-driven`,
    messages,
  })

  return result.toDataStreamResponse()
}