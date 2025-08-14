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

// Demo responses - Terminal Mode
const DEMO_RESPONSES = {
  default: "$ whoami\nDonny Smith - Brand strategist & digital designer\n$ ls -la skills/\nbranding/ design/ ai-automation/ code/ strategy/\n\nI help businesses build compelling visual identities and marketing systems. Currently exploring AI/automation in creative workflows. What can I help you with?",
  work: "$ cat portfolio.txt\nComprehensive brand development:\n- Visual identity design\n- Brand strategy & positioning  \n- Digital marketing implementation\n- Cross-industry client experience\n\n$ grep -r 'project_type' ~/work/\nLooking for help with a specific project? Let me know what you need.",
  contact: "$ ./connect.sh\nInitializing connection protocol...\n\nTo establish optimal workflow, please provide:\n- project_type: [branding|design|strategy|other]\n- timeline: [timeframe]\n- budget_range: [investment level]\n- contact_info: [your details]\n\nExecuting match algorithm...",
  ai: "$ python3 ai_workflow.py\nImporting creativity modules...\nLoading neural_design_patterns...\n\nDonny's exploring the intersection of AI and creative work - enhancing design processes while preserving human authenticity. The future of creative work is human-AI collaboration.",
  power: "$ sudo design --power-level=maximum\nDesign is systematic problem-solving. Every pixel, color, and typeface serves a strategic purpose. Good design doesn't just look good - it works. It transforms businesses and connects people.",
  creation: "$ git log --oneline design_philosophy\nUnderstand the problem\nCraft strategic solutions  \nVisualize compelling narratives\nIterate based on feedback\nDeploy at scale\n\nDesign = problem-solving + strategic thinking + visual execution"
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, provider = 'gpt-4o-mini' } = req.body
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

    // Demo mode - simple response that works with useChat
    if (!process.env.OPENAI_API_KEY) {
      console.log('Demo mode - no API key')
      
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
      
      console.log('Selected response:', response.substring(0, 100) + '...')
      
      // Add a small delay to show loading
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return in OpenAI ChatCompletion format that useChat expects
      return res.json({
        id: 'chatcmpl-demo',
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: 'demo',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: response
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: lastMessage.length,
          completion_tokens: response.length,
          total_tokens: lastMessage.length + response.length
        }
      })
    }

    // AI SDK v5 streaming (when API key is available)
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