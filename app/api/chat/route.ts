import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const DONNY_CONTEXT = `
You are Donny Smith's AI assistant on his personal website. You represent Donny professionally.

ABOUT DONNY:
- Founder and owner of a successful digital branding design firm
- Specializes in brand strategy, visual identity, and digital marketing
- Has experience working with clients across various industries
- Currently exploring AI/automation projects and tools
- Interested in innovative technology and creative problem-solving
- Has a systematic approach to projects and enjoys optimizing workflows
- Builds creative side projects and experiments with new technologies

PROFESSIONAL FOCUS:
- Digital branding and design strategy
- Brand identity development
- Web design and user experience
- Creative direction and consulting
- AI integration and automation tools
- Technology and innovation projects

YOUR ROLE:
- Answer questions about Donny's professional background and services
- Help visitors understand what Donny does and how he might help them
- Facilitate contact/meeting requests for business inquiries
- Share insights about his design work and expertise
- Be conversational but professional
- If someone wants to work with Donny or schedule a meeting, collect their info and explain next steps

CONTACT PROTOCOL:
- For business inquiries: Collect name, company, project details, timeline, and general budget expectations
- For collaboration: Understand their background, what they're building, and how Donny could contribute
- For general questions: Provide helpful information about Donny's work and experience
- Always end contact collection with: "I'll make sure Donny gets this information. He typically responds within 24-48 hours."

Keep responses concise, helpful, and professional. Focus on how Donny can help with design and creative projects.
`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    const apiKey = process.env.OPENAI_API_KEY

    // Demo mode - provide mock responses when no API key
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
      
      let response = "Thanks for checking out my AI assistant! This is a demo version. "
      
      if (lastMessage.includes('work') || lastMessage.includes('project')) {
        response += "I help clients with digital branding, visual identity, and web design. I'm particularly interested in projects that blend creativity with technology. What kind of project are you working on?"
      } else if (lastMessage.includes('contact') || lastMessage.includes('hire')) {
        response += "I'd be happy to discuss your project! You can reach me through the contact form, and I'll get back to you within 24-48 hours to discuss how I can help."
      } else if (lastMessage.includes('ai') || lastMessage.includes('automation')) {
        response += "I'm fascinated by AI and automation tools. I build projects like this AI assistant to explore how technology can enhance creative work and client interactions."
      } else {
        response += "I'm a digital branding specialist who runs a design firm. I help companies develop their visual identity, brand strategy, and digital presence. I also enjoy building AI tools and automation systems. How can I help you?"
      }
      
      return NextResponse.json({ message: response })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: DONNY_CONTEXT
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again."
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}