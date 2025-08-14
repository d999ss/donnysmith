import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Multiple AI providers configuration
const AI_PROVIDERS = {
  'gpt-4o-mini': { provider: 'openai', model: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  'gpt-4o': { provider: 'openai', model: 'gpt-4o', name: 'GPT-4o' },
  'gpt-3.5-turbo': { provider: 'openai', model: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
}

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

RESPONSE FORMAT:
- For simple questions, respond normally
- For project inquiries, structure your response with clear sections
- If someone wants to hire Donny, ask for: project type, timeline, budget range, contact info
- Always be helpful and represent Donny's expertise professionally

Keep responses engaging, helpful, and professional.
`

// Streaming response helper
function createStreamingResponse(text) {
  const encoder = new TextEncoder()
  const words = text.split(' ')
  
  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = i === 0 ? words[i] : ' ' + words[i]
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk, done: false })}\n\n`))
        
        // Simulate natural typing speed
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
      }
      
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: '', done: true })}\n\n`))
      controller.close()
    }
  })
}

// Demo responses - Professional Assistant Mode
const DEMO_RESPONSES = {
  default: "Thanks for visiting! I'm Donny's AI assistant, here to help you learn about his design work and expertise. Donny is a brand strategist and digital designer who helps businesses create compelling visual identities and marketing solutions. What would you like to know about his work?",
  work: "Donny specializes in comprehensive brand development - from initial strategy and visual identity design to digital marketing implementation. He's worked with clients across various industries, creating memorable brands that drive business growth. Are you looking for help with a specific type of project?",
  contact: "I'd be happy to help you connect with Donny! To better understand how he might assist you, could you share some details about your project? What type of branding or design work are you considering, what's your timeline, and do you have a budget range in mind?",
  ai: "Great question! Donny is passionate about integrating AI and automation into creative workflows. He's been exploring how AI tools can enhance design processes while maintaining the human touch that makes brands authentic. He's always interested in discussing the intersection of technology and creativity.",
  power: "Donny believes in the power of good design to transform businesses. Through strategic branding and thoughtful visual communication, he helps companies connect more effectively with their audiences and achieve their goals.",
  creation: "Design is problem-solving at its core. Donny approaches each project by first understanding the challenge, then crafting solutions that are both visually compelling and strategically sound. Every element serves a purpose in telling the brand's story."
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, provider = 'gpt-4o-mini' } = req.body
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

    // Demo mode responses
    if (!process.env.OPENAI_API_KEY) {
      let response = DEMO_RESPONSES.default
      
      if (lastMessage.includes('work') || lastMessage.includes('project') || lastMessage.includes('branding')) {
        response = DEMO_RESPONSES.work
      } else if (lastMessage.includes('contact') || lastMessage.includes('hire') || lastMessage.includes('discuss')) {
        response = DEMO_RESPONSES.contact
      } else if (lastMessage.includes('ai') || lastMessage.includes('automation') || lastMessage.includes('technology')) {
        response = DEMO_RESPONSES.ai
      } else if (lastMessage.includes('power') || lastMessage.includes('god') || lastMessage.includes('infinite')) {
        response = DEMO_RESPONSES.power
      } else if (lastMessage.includes('create') || lastMessage.includes('build') || lastMessage.includes('design')) {
        response = DEMO_RESPONSES.creation
      }
      
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return res.json({ message: response, provider: 'demo' })
    }

    // AI SDK v5 streaming
    const result = await streamText({
      model: openai(provider),
      system: DONNY_CONTEXT,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Failed to generate response' })
  }
}