import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Create a mock OpenAI instance for demo
const openai = createOpenAI({
  apiKey: 'demo-key',
  baseURL: 'https://api.openai.com/v1', // This won't be called since we'll override
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    const userMessage = messages?.[messages.length - 1]?.content || 'hello'
    
    // Mock response without calling OpenAI
    const mockResponse = `$ echo "${userMessage}"
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

    // Create a readable stream that AI SDK expects
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        // Send data in the format AI SDK expects
        const chunks = mockResponse.split('')
        let i = 0
        
        const sendChunk = () => {
          if (i < chunks.length) {
            controller.enqueue(encoder.encode(`0:"${chunks[i]}"\n`))
            i++
            setTimeout(sendChunk, 20)
          } else {
            controller.close()
          }
        }
        
        setTimeout(sendChunk, 500) // Small delay
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
    
  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ error: error.message })
  }
}