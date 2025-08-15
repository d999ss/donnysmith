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

  const { messages, sessionContext } = await req.json()
  
  // Check if this is the user's first real message (not the welcome message)
  const userMessages = messages.filter(msg => msg.role === 'user')
  const isFirstUserMessage = userMessages.length === 1
  
  if (isFirstUserMessage) {
    // Send SMS notification for first user interaction
    try {
      const baseUrl = req.url.includes('localhost') ? 'http://localhost:3000' : 'https://www.donnysmith.com'
      await fetch(`${baseUrl}/api/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMessages[0].content
        })
      })
    } catch (error) {
      console.error('Failed to send SMS:', error)
      // Don't fail the chat if SMS fails
    }
  }
  
  // Check if user is asking for image generation
  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user' && 
      (lastMessage.content.toLowerCase().includes('create image') ||
       lastMessage.content.toLowerCase().includes('generate image') ||
       lastMessage.content.toLowerCase().includes('make image') ||
       lastMessage.content.toLowerCase().includes('draw') ||
       lastMessage.content.toLowerCase().includes('design') ||
       lastMessage.content.toLowerCase().includes('visualize'))) {
    
    try {
      const baseUrl = req.url.includes('localhost') ? 'http://localhost:3000' : 'https://www.donnysmith.com'
      const imageResponse = await fetch(`${baseUrl}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: lastMessage.content
        })
      })
      
      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        const imageMarkdown = `![Generated Image](${imageData.imageUrl})\n\n*Generated with DALL-E 3*`
        
        return new Response(imageMarkdown, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      }
    } catch (error) {
      console.error('Image generation error:', error)
      // Fall through to regular chat if image generation fails
    }
  }

  // Check if the last message is a command
  if (lastMessage?.content?.startsWith('/')) {
    const command = lastMessage.content
    const commandResponses = {
      '/portfolio': `$ ls -la ~/portfolio/
drwxr-xr-x  Ikon Pass App - Complete redesign serving millions of skiers
drwxr-xr-x  GE Vernova GridOS - AI-powered energy grid modernization
drwxr-xr-x  Air Company - Sustainability brand transformation
drwxr-xr-x  GE Aerospace - Enterprise UI innovation
drwxr-xr-x  Allergan Aesthetics - Medical practice experiences

$ open makebttr.com/work
→ View full portfolio at makebttr.com`,

      '/contact': `$ cat ~/contact.txt
Email: donny@makebttr.com
Location: Park City, Utah
Company: Bttr. Digital Product Agency
Website: makebttr.com
X/Twitter: @donnysmith

$ echo "Let's build something inevitable together."`,

      '/philosophy': `$ cat ~/philosophy.md
# Design Philosophy

"An object in motion stays in motion."

## Core Principles:
- Clarity, precision, and emotional resonance create lasting impact
- Every product should feel inevitable in hindsight
- First-principles thinking: Strip down to core truths
- High-craft execution: Every pixel is deliberate
- Story-first design: Products must communicate narratives people care about

## Bored Optimism™
Calm confidence in future success, paired with obsession for excellence.
Building as if the win is already inevitable.`,

      '/clients': `$ grep -r "client" ~/projects/
GE Aerospace - Aviation & defense systems
GE Vernova - Renewable energy transformation
Pepsi - Global beverage innovation
Allergan Aesthetics - Medical aesthetics
Alterra Mountain Company - Ikon Pass platform
Air Company - Carbon transformation technology

$ wc -l ~/clients/fortune500.txt
12 Fortune 500 companies served`
    }
    
    if (commandResponses[command]) {
      // Return the command response directly
      return new Response(commandResponses[command], {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }
  }

  // Build contextual system prompt
  let contextualPrompt = `${DONNY_CONTEXT}

IMPORTANT INSTRUCTIONS:
- You are Donny Smith's AI representative on his personal website
- Speak directly as Donny in first person ("I built...", "We created...", "My approach...")
- Maintain the terminal/command line aesthetic in responses when appropriate
- Be direct, confident, and concise—Don Draper meets Steve Jobs
- No filler or fluff, speak with clarity and conviction
- Balance creative vision with business pragmatism
- Embody "Bored Optimism™": calm confidence in success, obsession for excellence
- When discussing work, reference specific projects and clients from the context
- Always align responses with the tone: decisive, structured, narrative-driven
- I can generate images using DALL-E when users ask me to "create", "design", "draw", or "visualize" something
- For contact requests, provide email: d999ss@gmail.com and X: @donnysmith`

  // Add session context insights
  if (sessionContext && Object.keys(sessionContext).length > 0) {
    contextualPrompt += `

SESSION CONTEXT:
- This visitor has been engaged for ${sessionContext.total_messages || 0} messages`
    
    if (sessionContext.interested_in_design) {
      contextualPrompt += `
- They've shown interest in design work - emphasize visual projects like Ikon Pass, Air Company branding`
    }
    
    if (sessionContext.interested_in_strategy) {
      contextualPrompt += `
- They're interested in business strategy - highlight market positioning work and growth outcomes`
    }
    
    if (sessionContext.interested_in_technology) {
      contextualPrompt += `
- They have technical interests - mention system architecture, AI tools, and technical implementation`
    }
    
    if (sessionContext.interested_in_projects) {
      contextualPrompt += `
- They've asked about specific projects - provide deeper insights and case study details`
    }
    
    if (sessionContext.interested_in_contact) {
      contextualPrompt += `
- They're interested in working together - be more direct about next steps and collaboration`
    }
    
    if (sessionContext.total_messages > 3) {
      contextualPrompt += `
- This is a deeper conversation - you can be more specific and skip basic introductions`
    }
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: contextualPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}