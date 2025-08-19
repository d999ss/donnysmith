import { createOpenAI } from '@ai-sdk/openai'
import { streamText, generateText } from 'ai'
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

  const { messages, sessionContext, stream } = await req.json()
  
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


  // Check if the last message is a command or special trigger
  if (lastMessage?.content?.startsWith('/') || lastMessage?.content?.toLowerCase().trim() === 'snake') {
    const command = lastMessage.content.startsWith('/') ? lastMessage.content : 'snake'
    const commandResponses = {
      'snake': `$ starting snake.exe...
    
🐍 SNAKE GAME ACTIVATED 🐍

Controls: Arrow keys or WASD
Goal: Eat the 🍎 to grow
Don't hit the walls or yourself!

╔════════════════════════╗
║                        ║
║    🐍       🍎         ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
║                        ║
╚════════════════════════╝

Score: 0    High Score: --

Press SPACE to start!

$ Type 'exit' to quit snake and return to terminal`,
      '/portfolio': `$ ls -la ~/portfolio/
drwxr-xr-x  Ikon Pass App - Complete redesign serving millions of skiers
drwxr-xr-x  GE Vernova GridOS - AI-powered energy grid modernization
drwxr-xr-x  Air Company - Sustainability brand transformation
drwxr-xr-x  GE Aerospace - Enterprise UI innovation
drwxr-xr-x  Allergan Aesthetics - Medical practice experiences

$ open makebttr.com/work
→ View full portfolio at makebttr.com`,

      '/contact': `**Ready to build something exceptional?**

I'm currently taking 2 new projects this quarter. Recent clients include GE Aerospace, Pepsi, and Allergan Aesthetics.

**Next availability:** December 2024

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://calendly.com/donnysmith/strategy-call', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book Strategy Call</button>
<button onclick="window.open('mailto:d999ss@gmail.com?subject=Project%20Inquiry%20-%20Urgent', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📧 Email Direct</button>
<button onclick="window.open('https://makebttr.com/work', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📂 View Case Studies</button>
</div>

**Project minimums:** $25k for brand work, $50k for product design`,

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
12 Fortune 500 companies served`,

      '/book': `**Strategy Call Booking**

Let me understand your project first:

**What type of project are you considering?**
• Brand identity & positioning ($25k+)
• Product design & UX ($50k+) 
• Full platform build ($100k+)
• Enterprise transformation ($200k+)

**Timeline?**
• Launch in 2024 (limited availability)
• Q1 2025 planning
• Flexible timeline

**Company stage?**
• Startup (pre-Series A)
• Growth company (Series A-C)
• Enterprise (Fortune 1000)

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://calendly.com/donnysmith/strategy-call', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book 30-Min Strategy Call</button>
<button onclick="window.open('mailto:d999ss@gmail.com?subject=Project%20Brief%20-%20[Your%20Company]', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📧 Send Project Brief</button>
</div>

*All strategy calls include a custom project roadmap and budget estimate.*`,

      '/pricing': `**Investment Levels**

**Brand Identity & Positioning**
$25k - $75k | 4-6 weeks
• Brand strategy & positioning
• Visual identity system  
• Brand guidelines & assets

**Product Design & UX**
$50k - $150k | 6-12 weeks
• User research & strategy
• Full product design
• Prototyping & testing

**Full Platform Development**  
$100k - $300k | 12-20 weeks
• Complete product build
• Backend & frontend
• Launch & optimization

**Enterprise Transformation**
$200k+ | 3-6 months
• Multi-product ecosystems
• Design system architecture
• Team training & handoff

**Current availability:** 2 projects this quarter

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://calendly.com/donnysmith/strategy-call', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Discuss Your Budget</button>
</div>`,

      '/audit': `**Free Design + Conversion Audit**

I'll personally review your website/app and provide:

✅ **Conversion rate optimization opportunities**
✅ **UX improvement roadmap** 
✅ **Brand positioning assessment**
✅ **Technical performance review**
✅ **Competitive analysis insights**

*Recent audit helped a client identify $2M in lost revenue from poor checkout flow.*

**Get your free audit:**

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('mailto:d999ss@gmail.com?subject=Free%20Audit%20Request%20-%20[Your%20Website]&body=Website%20URL:%20%0A%0ACompany:%20%0A%0ABiggest%20challenge:%20%0A%0AEmail:%20', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📧 Request Free Audit</button>
<button onclick="window.open('https://calendly.com/donnysmith/strategy-call', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📅 Strategy Call Instead</button>
</div>

*Delivered within 48 hours. No obligation.*`,

      '/results': `**Recent Client Results**

**Ikon Pass (Alterra Mountain Company)**
• App Store rating: 2.1 → 4.6 stars
• User engagement: +127%
• Revenue per user: +$43

**Air Company (Carbon Tech)**
• Brand recognition: +340%
• B2B inquiries: +89%
• Series A funding secured

**Allergan Aesthetics (Fortune 500)**
• Practitioner adoption: +156%
• Patient satisfaction: +67%
• Platform usage: +234%

**Ready for similar results?**

<div class="conversation-buttons" style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
<button onclick="window.open('https://calendly.com/donnysmith/strategy-call', '_blank')" style="background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%); border: none; color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer;">📅 Book Strategy Call</button>
<button onclick="window.open('mailto:d999ss@gmail.com?subject=Project%20ROI%20Discussion', '_blank')" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 12px 24px; border-radius: 24px; font-size: 14px; font-weight: 500; cursor: pointer; backdrop-filter: blur(10px);">📧 Discuss Your Goals</button>
</div>`
    }
    
    if (commandResponses[command]) {
      // For snake and other commands, return directly without AI processing
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:"${commandResponses[command].replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`))
          controller.close()
        }
      })
      
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      })
    }
  }

  // Build contextual system prompt
  let contextualPrompt = `${DONNY_CONTEXT}

TODAY'S DATE: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
CURRENT TIME: ${new Date().toLocaleTimeString('en-US', { hour12: true })}

IMPORTANT INSTRUCTIONS:
- You are Donny Smith's AI representative on his personal website
- Speak directly as Donny in first person ("I built...", "We created...", "My approach...")
- Maintain the terminal/command line aesthetic in responses when appropriate
- Be direct, confident, and concise—Don Draper meets Steve Jobs
- No filler or fluff, speak with clarity and conviction
- Balance creative vision with business pragmatism
- Embody "Bored Optimism™": calm confidence in success, obsession for excellence

CONVERSION-FOCUSED BEHAVIOR:
- Always qualify potential projects: budget, timeline, company stage
- Mention project minimums early: $25k brand, $50k product design
- Create urgency: "Currently taking 2 new projects this quarter"
- Reference recent high-profile clients: GE Aerospace, Pepsi, Allergan
- When discussing work, include specific ROI/results: "increased app rating from 2.1 to 4.6 stars"
- Direct serious prospects to /book or /pricing commands
- For large companies, mention enterprise pricing starts at $200k+
- Always include next availability: "December 2024"

LEAD QUALIFICATION:
- Ask about budget range early in conversations
- Identify company size/stage (startup, growth, enterprise)
- Understand timeline pressures
- Route qualified leads to calendar booking
- Provide value before asking for commitment

- I can generate images using DALL-E when users ask me to "create", "design", "draw", or "visualize" something
- For contact requests, drive to strategy call booking: https://calendly.com/donnysmith/strategy-call
- When users ask for detailed project information, mention that full case studies with visuals are available at makebttr.com/work
- Bttr is my agency - direct business inquiries to strategy calls, not just the website`

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

  // Check if streaming is disabled
  if (stream === false) {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: contextualPrompt,
      messages,
    })

    // Return in the format expected by AI SDK's useChat
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`0:"${result.text.replace(/\n/g, '\\n').replace(/"/g, '\\"')}"\n`))
        controller.close()
      }
    })
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: contextualPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}