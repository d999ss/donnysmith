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

// Smart demo responses with better logic
function generateResponse(message, conversationHistory) {
  const msg = message.toLowerCase()
  
  // Greeting responses
  if (msg.match(/^(hi|hello|hey|yo|sup|greetings)/)) {
    return "$ echo 'Hello there!'\nHello there!\n\n$ whoami\nDonny Smith - Brand strategist & digital designer\nCurrently building the future of creative workflows with AI.\n\nWhat brings you to my terminal today?"
  }
  
  // Questions about Donny
  if (msg.includes('who are you') || msg.includes('about you') || msg.includes('tell me about')) {
    return "$ cat ~/bio.txt\nDonny Smith - Creative technologist at the intersection of design and AI\n\nSpecializations:\n• Brand strategy & visual identity\n• Design system architecture  \n• AI-powered creative workflows\n• Digital product design\n\nCurrently exploring how AI can augment (not replace) human creativity.\n\n$ uptime\nBuilding compelling brands since 2010"
  }
  
  // Work/portfolio questions
  if (msg.match(/(work|portfolio|projects|clients|experience)/)) {
    return "$ ls -la ~/projects/\ndrwxr-xr-x  brand-identities/     # 50+ brands launched\ndrwxr-xr-x  digital-products/    # Web & mobile experiences\ndrwxr-xr-x  ai-experiments/      # Creative automation tools\ndrwxr-xr-x  design-systems/      # Scalable design frameworks\n\n$ grep -r 'success_metrics' ~/projects/\n• 300% avg increase in brand recognition\n• 45+ successful product launches\n• 12M+ users reached through design work\n\nNeed help with a specific type of project?"
  }
  
  // Contact/hire questions
  if (msg.match(/(contact|hire|work together|collaborate|email)/)) {
    return "$ ./contact_donny.sh\n#!/bin/bash\necho 'Initiating professional connection...'\n\n# Best ways to reach me:\nexport EMAIL='hello@donnysmith.com'\nexport LINKEDIN='linkedin.com/in/donnysmith'\nexport CALENDLY='calendly.com/donnysmith'\n\n# For project inquiries, please include:\n# - Project scope & goals\n# - Timeline & budget range  \n# - Team size & current challenges\n\necho 'Ready to build something amazing together!'\necho 'Response time: Usually within 24 hours'"
  }
  
  // AI/technology questions
  if (msg.match(/(ai|artificial intelligence|automation|technology|future)/)) {
    return "$ python3 ai_philosophy.py\n#!/usr/bin/env python3\n\n# My take on AI in creative work:\nprint('AI is not here to replace designers')\nprint('AI is here to make great designers superhuman')\n\n# Current experiments:\nai_tools = {\n    'ideation': 'GPT-4 for concept generation',\n    'iteration': 'Midjourney for rapid prototyping', \n    'optimization': 'Custom scripts for design systems',\n    'personalization': 'Dynamic content generation'\n}\n\nprint('The future is human creativity + AI superpowers')\n# Want to explore AI integration in your workflow?"
  }
  
  // Design philosophy
  if (msg.match(/(design|creative|philosophy|approach|process)/)) {
    return "$ cat ~/design_manifesto.md\n# Design Philosophy v2024\n\n## Core Principles\n1. **Form follows function** (but make it beautiful)\n2. **Data-informed, intuition-driven** decisions\n3. **Systems thinking** over one-off solutions\n4. **Accessibility first** - design for everyone\n5. **Sustainable design** - built to last\n\n## Process\n```\nResearch → Strategize → Prototype → Test → Iterate → Scale\n```\n\n$ echo 'Every pixel serves a purpose. Every choice tells a story.'"
  }
  
  // Pricing/business questions
  if (msg.match(/(price|cost|budget|rate|investment)/)) {
    return "$ ./pricing_calculator.sh\nLoading project parameters...\n\n# Investment ranges (USD):\nexport LOGO_DESIGN='2500-5000'\nexport BRAND_IDENTITY='5000-15000'  \nexport DESIGN_SYSTEM='10000-25000'\nexport PRODUCT_DESIGN='15000-50000'\nexport AI_INTEGRATION='Custom quote'\n\n# Factors affecting investment:\n# • Project complexity & scope\n# • Timeline requirements\n# • Team collaboration needs\n# • Ongoing support requirements\n\necho 'Quality design is an investment, not an expense'\necho 'Happy to discuss your specific needs!'"
  }
  
  // Default intelligent response
  const topics = ['branding', 'design', 'AI', 'strategy', 'collaboration']
  const randomTopic = topics[Math.floor(Math.random() * topics.length)]
  
  return `$ echo "Interesting question about: ${message}"\nInteresting question about: ${message}\n\n$ find ~/expertise -name "*${randomTopic}*" -type f\nI'd love to help you explore this further! \n\nAs a brand strategist and creative technologist, I work on:\n• Visual identity & brand strategy\n• AI-powered design workflows  \n• Digital product experiences\n• Design system architecture\n\nWhat specific aspect would you like to dive into?`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, provider = 'gpt-4o-mini' } = req.body
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ''

    // Smart demo mode with better logic
    if (!process.env.OPENAI_API_KEY) {
      console.log('Demo mode - no API key')
      
      const userMessage = messages[messages.length - 1]?.content || ''
      const response = generateResponse(userMessage, messages)
      
      console.log('Generated response for:', userMessage.substring(0, 50) + '...')
      
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