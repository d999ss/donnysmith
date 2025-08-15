import OpenAI from 'openai'

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt } = req.body
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    })
    
    const imageUrl = imageResponse.data[0].url
    
    return res.status(200).json({ 
      success: true,
      imageUrl: imageUrl,
      prompt: prompt
    })

  } catch (error) {
    console.error('DALL-E Error:', error)
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
}