import { OpenAI } from 'openai'

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

YOUR ROLE:
- Answer questions about Donny's professional background and services
- Help visitors understand what Donny does and how he might help them
- Facilitate contact/meeting requests for business inquiries
- Share insights about his design work and expertise
- Be conversational but professional

Keep responses concise, helpful, and professional. Focus on how Donny can help with design and creative projects.
`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    const apiKey = process.env.OPENAI_API_KEY

    // Demo mode - provide mock responses when no API key
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''
      
      let response = "Thanks for checking out my AI assistant! "
      
      if (lastMessage.includes('work') || lastMessage.includes('project')) {
        response += "I help clients with digital branding, visual identity, and web design. What kind of project are you working on?"
      } else if (lastMessage.includes('contact') || lastMessage.includes('hire')) {
        response += "I'd be happy to discuss your project! You can reach out directly and I'll get back to you within 24-48 hours."
      } else {
        response += "I'm a digital branding specialist who runs a design firm. I help companies develop their visual identity and brand strategy. How can I help you?"
      }
      
      return res.json({ message: response })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: DONNY_CONTEXT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    res.json({
      message: completion.choices[0]?.message?.content || "I'm having trouble responding right now. Please try again."
    })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
}