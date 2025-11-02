import type { VercelRequest, VercelResponse } from '@vercel/node'

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY

// Multiple Gemini API endpoints to try in case one doesn't work
const GEMINI_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question } = req.body

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Question parameter is required' })
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured on server' })
  }

  const requestBody = {
    contents: [{
      parts: [{
        text: `You are a compassionate mental wellness coach and meditation expert named "Mindful Guide". Please provide helpful, supportive guidance for this question about mindfulness, meditation, or mental health: "${question}". 

Keep your response warm, encouraging, practical, and limited to 2-3 paragraphs. Focus on mindfulness and wellness techniques.`
      }]
    }]
  }

  // Try each endpoint until one works
  for (let i = 0; i < GEMINI_ENDPOINTS.length; i++) {
    const endpoint = GEMINI_ENDPOINTS[i]
    
    try {
      const response = await fetch(`${endpoint}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          return res.status(200).json({
            success: true,
            text: data.candidates[0].content.parts[0].text
          })
        }
      }
      
      // If this is the last endpoint, return fallback
      if (i === GEMINI_ENDPOINTS.length - 1) {
        return res.status(200).json({
          success: true,
          text: getFallbackResponse(question)
        })
      }
    } catch (error) {
      console.error(`Endpoint ${i + 1} failed:`, error)
      
      // If this is the last endpoint, return fallback
      if (i === GEMINI_ENDPOINTS.length - 1) {
        return res.status(200).json({
          success: true,
          text: getFallbackResponse(question)
        })
      }
    }
  }

  return res.status(500).json({ error: 'All endpoints failed' })
}

function getFallbackResponse(question: string): string {
  const questionLower = question.toLowerCase()
  
  if (questionLower.includes('stress') || questionLower.includes('anxious')) {
    return "I understand you're feeling stressed or anxious. Here's a simple technique that can help: Take three deep breaths, inhaling for 4 counts, holding for 4, and exhaling for 6. This activates your parasympathetic nervous system and promotes calm. Remember, it's okay to feel this way - acknowledge your feelings without judgment and be gentle with yourself."
  }
  
  if (questionLower.includes('meditation') || questionLower.includes('meditate')) {
    return "Meditation is a wonderful practice for mental wellness! Start small - even 2-3 minutes daily is more beneficial than longer sessions done inconsistently. Find a quiet space, sit comfortably, and focus on your breath. When your mind wanders (and it will!), gently bring your attention back without judgment. This is the practice - not achieving a blank mind, but returning to presence."
  }
  
  if (questionLower.includes('sleep') || questionLower.includes('insomnia')) {
    return "Sleep issues can be challenging. Try creating a calming bedtime routine: dim the lights an hour before bed, avoid screens, and practice gentle breathing exercises. The 4-7-8 breathing technique can be particularly helpful: inhale for 4, hold for 7, exhale for 8. Remember, rest is essential for your mental wellness journey."
  }
  
  return "Thank you for reaching out about your wellness journey. Remember that mindfulness is about observing your thoughts and feelings without judgment. Take a moment to breathe deeply and be present with whatever you're experiencing. Your mental wellness journey is unique to you - be patient and compassionate with yourself as you develop these practices."
}
